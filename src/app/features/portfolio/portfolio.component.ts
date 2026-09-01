import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, Subject, takeUntil } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import type { ChartConfiguration } from 'chart.js';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { SharedModule } from '../../shared/modules/shared.module';
import { ConfirmService } from '../../shared/services/confirm.service';
import { NotificationService } from '../../shared/services/notification.service';
import { loadPortfolio, addStock, addInvestment, deleteStock } from '../../store/portfolio/portfolio.actions';
import { loadSectors } from '../../store/stock-sector/stock-sector.actions';
import {
  selectPortfolioSummary,
  selectPortfolioLoading,
  selectPortfolioError,
  selectHoldings,
  selectSectorAllocations,
} from '../../store/portfolio/portfolio.selectors';
import { selectAllSectors } from '../../store/stock-sector/stock-sector.selectors';
import { InvestmentHistoryDTO, PortfolioHoldingDTO } from '../../core/models/portfolio.models';
import { PortfolioService } from '../../core/services/portfolio.service';
import { AddStockDialogComponent } from './add-stock-dialog.component';
import { AddInvestmentDialogComponent } from './add-investment-dialog.component';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [SharedModule, BaseChartDirective],
  providers: [provideCharts(withDefaultRegisterables())],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.css',
})
export class PortfolioComponent implements OnInit, OnDestroy {
  private readonly store = inject(Store);
  private readonly portfolioService = inject(PortfolioService);
  private readonly confirm = inject(ConfirmService);
  private readonly notify = inject(NotificationService);
  private readonly dialog = inject(MatDialog);
  private readonly destroy$ = new Subject<void>();

  readonly summary$ = this.store.select(selectPortfolioSummary);
  readonly loading$ = this.store.select(selectPortfolioLoading);
  readonly error$ = this.store.select(selectPortfolioError);
  readonly holdings$ = this.store.select(selectHoldings);
  readonly sectors$ = this.store.select(selectAllSectors);

  readonly holdingsColumns = [
    'expand', 'ticker', 'stockName', 'sector', 'quantity',
    'avgBuyingPrice', 'currentPrice', 'investedAmount', 'pnL', 'actions',
  ];
  readonly historyColumns = ['date', 'buyingPrice', 'quantity', 'amount'];
  readonly holdingsDataSource = new MatTableDataSource<PortfolioHoldingDTO>([]);

  @ViewChild(MatSort) set sort(s: MatSort | undefined) {
    if (s) this.holdingsDataSource.sort = s;
  }
  @ViewChild('holdingsPaginator') set holdingsPaginator(p: MatPaginator | undefined) {
    if (p) this.holdingsDataSource.paginator = p;
  }

  readonly sectorChartData$ = this.store.select(selectSectorAllocations).pipe(
    map((allocations): ChartConfiguration<'doughnut'>['data'] => ({
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

  readonly chartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { padding: 16, font: { size: 12 } } },
    },
    cutout: '65%',
  };

  readonly today = new Date();

  // Investment history state
  expandedStockId: string | null = null;
  investmentHistory: InvestmentHistoryDTO[] = [];
  historyTotalCount = 0;
  historyPage = 1;
  readonly historyPageSize = 5;
  historyLoading = false;

  ngOnInit(): void {
    this.store.dispatch(loadPortfolio());
    this.store.dispatch(loadSectors());

    this.holdings$.pipe(takeUntil(this.destroy$)).subscribe((holdings) => {
      this.holdingsDataSource.data = holdings ?? [];
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  refresh(): void {
    this.store.dispatch(loadPortfolio());
  }

  isExpanded(row: PortfolioHoldingDTO): boolean {
    return this.expandedStockId === row.stockId;
  }

  openAddStockDialog(): void {
    this.dialog
      .open(AddStockDialogComponent, {
        width: '420px',
        data: { sectors$: this.sectors$, loading$: this.loading$ },
      })
      .afterClosed()
      .subscribe((request) => {
        if (request) this.store.dispatch(addStock({ request }));
      });
  }

  openAddInvestmentDialog(): void {
    this.dialog
      .open(AddInvestmentDialogComponent, {
        width: '420px',
        data: { holdings$: this.holdings$, loading$: this.loading$ },
      })
      .afterClosed()
      .subscribe((request) => {
        if (request) this.store.dispatch(addInvestment({ request }));
      });
  }

  async confirmDeleteStock(stockId: string, ticker: string): Promise<void> {
    const ok = await this.confirm.confirm({
      header: 'Delete Stock',
      message: `Delete <strong>${ticker}</strong> and all its investment history? This cannot be undone.`,
      icon: 'warning',
      acceptTone: 'danger',
      acceptLabel: 'Delete',
    });
    if (ok) this.store.dispatch(deleteStock({ stockId }));
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

  onHistoryPageChange(event: PageEvent): void {
    if (!this.expandedStockId) return;
    this.historyPage = event.pageIndex + 1;
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
        this.notify.error('Error', 'Failed to load investment history.');
      },
    });
  }
}
