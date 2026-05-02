import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { PaginatorState } from 'primeng/paginator';
import { Store } from '@ngrx/store';
import { map, Subject } from 'rxjs';
import { SharedModule } from '../../shared/modules/shared.module';
import { loadPortfolio, addStock, addInvestment } from '../../store/portfolio/portfolio.actions';
import { loadSectors } from '../../store/stock-sector/stock-sector.actions';
import {
  selectPortfolioSummary,
  selectPortfolioLoading,
  selectPortfolioError,
  selectHoldings,
  selectSectorAllocations,
} from '../../store/portfolio/portfolio.selectors';
import { selectAllSectors } from '../../store/stock-sector/stock-sector.selectors';
import { InvestmentHistoryDTO } from '../../core/models/portfolio.models';
import { PortfolioService } from '../../core/services/portfolio.service';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.css',
})
export class PortfolioComponent implements OnInit, OnDestroy {
  private readonly store = inject(Store);
  private readonly fb = inject(FormBuilder);
  private readonly portfolioService = inject(PortfolioService);
  private readonly destroy$ = new Subject<void>();

  readonly summary$ = this.store.select(selectPortfolioSummary);
  readonly loading$ = this.store.select(selectPortfolioLoading);
  readonly error$ = this.store.select(selectPortfolioError);
  readonly holdings$ = this.store.select(selectHoldings);
  readonly sectors$ = this.store.select(selectAllSectors);

  readonly sectorChartData$ = this.store.select(selectSectorAllocations).pipe(
    map((allocations) => ({
      labels: allocations.map((s) => s.sectorName),
      datasets: [
        {
          data: allocations.map((s) => s.allocationPercent),
          backgroundColor: [
            '#6366f1', '#22c55e', '#f59e0b', '#ef4444',
            '#3b82f6', '#8b5cf6', '#14b8a6', '#f97316',
          ],
          hoverOffset: 6,
        },
      ],
    }))
  );

  readonly chartOptions = {
    plugins: {
      legend: { position: 'bottom', labels: { padding: 16, font: { size: 12 } } },
    },
    cutout: '65%',
  };

  showAddStockDialog = false;
  showAddInvestmentDialog = false;
  readonly today = new Date();

  // Investment history state
  expandedStockId: string | null = null;
  investmentHistory: InvestmentHistoryDTO[] = [];
  historyTotalCount = 0;
  historyPage = 1;
  readonly historyPageSize = 5;
  historyLoading = false;

  readonly stockForm = this.fb.group({
    ticker: ['', [Validators.required, Validators.maxLength(20)]],
    stockName: ['', [Validators.required, Validators.maxLength(100)]],
    stockSectorId: ['', Validators.required],
    stockPE: [null as number | null],
  });

  readonly investmentForm = this.fb.group({
    stockId: ['', Validators.required],
    investedAmount: [null as number | null, [Validators.required, Validators.min(1)]],
    buyingPrice: [null as number | null, [Validators.required, Validators.min(0.01)]],
    investmentDate: [null as Date | null, Validators.required],
  });

  ngOnInit(): void {
    this.store.dispatch(loadPortfolio());
    this.store.dispatch(loadSectors());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  refresh(): void {
    this.store.dispatch(loadPortfolio());
  }

  openAddInvestmentDialog(): void {
    this.investmentForm.reset();
    this.showAddInvestmentDialog = true;
  }

  toggleHistory(stockId: string): void {
    if (this.expandedStockId === stockId) {
      this.expandedStockId = null;
      this.investmentHistory = [];
      this.historyTotalCount = 0;
      this.historyPage = 1;
      return;
    }
    this.expandedStockId = stockId;
    this.historyPage = 1;
    this.loadHistory(stockId, 1);
  }

  onHistoryPageChange(event: PaginatorState): void {
    if (!this.expandedStockId) return;
    const first = event.first ?? 0;
    const rows = event.rows ?? this.historyPageSize;
    this.historyPage = Math.floor(first / rows) + 1;
    this.loadHistory(this.expandedStockId, this.historyPage);
  }

  private loadHistory(stockId: string, page: number): void {
    this.historyLoading = true;
    this.portfolioService.getInvestmentsByStock(stockId, page, this.historyPageSize).subscribe({
      next: (result) => {
        this.investmentHistory = result.items;
        this.historyTotalCount = result.totalCount;
        this.historyLoading = false;
      },
      error: () => {
        this.investmentHistory = [];
        this.historyTotalCount = 0;
        this.historyLoading = false;
      },
    });
  }

  submitAddStock(): void {
    if (this.stockForm.invalid) return;
    const v = this.stockForm.value;
    this.store.dispatch(
      addStock({
        request: {
          ticker: v.ticker!,
          stockName: v.stockName!,
          stockSectorId: v.stockSectorId!,
          stockPE: v.stockPE ?? null,
        },
      })
    );
    this.stockForm.reset();
    this.showAddStockDialog = false;
  }

  submitAddInvestment(): void {
    if (this.investmentForm.invalid) return;
    const v = this.investmentForm.value;
    const date = v.investmentDate as Date;
    this.store.dispatch(
      addInvestment({
        request: {
          stockId: v.stockId!,
          investedAmount: v.investedAmount!,
          buyingPrice: v.buyingPrice!,
          investmentDate: date.toISOString(),
        },
      })
    );
    this.investmentForm.reset();
    this.showAddInvestmentDialog = false;
  }
}
