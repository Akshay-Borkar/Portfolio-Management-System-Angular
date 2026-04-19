import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { SharedModule } from '../../shared/modules/shared.module';
import { selectAllSectors, selectSectorsLoading } from '../../store/stock-sector/stock-sector.selectors';
import { loadSectors } from '../../store/stock-sector/stock-sector.actions';
import { selectCurrentUser } from '../../store/auth/auth.selectors';
import { loadPortfolio } from '../../store/portfolio/portfolio.actions';
import {
  selectPortfolioLoading,
  selectPortfolioSummary,
} from '../../store/portfolio/portfolio.selectors';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  private readonly store = inject(Store);

  readonly currentUser$ = this.store.select(selectCurrentUser);
  readonly sectorCount$ = this.store.select(selectAllSectors).pipe(map((s) => s.length));
  readonly sectorsLoading$ = this.store.select(selectSectorsLoading);
  readonly portfolioLoading$ = this.store.select(selectPortfolioLoading);
  readonly portfolioSummary$ = this.store.select(selectPortfolioSummary);

  readonly topGainers$ = this.store.select(selectPortfolioSummary).pipe(
    map((s) =>
      [...(s?.holdings ?? [])]
        .sort((a, b) => b.pnLPercent - a.pnLPercent)
        .slice(0, 4)
    )
  );

  readonly topLosers$ = this.store.select(selectPortfolioSummary).pipe(
    map((s) =>
      [...(s?.holdings ?? [])]
        .sort((a, b) => a.pnLPercent - b.pnLPercent)
        .slice(0, 4)
    )
  );

  ngOnInit(): void {
    this.store.dispatch(loadSectors());
    this.store.dispatch(loadPortfolio());
  }
}
