import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import { map, Subscription, take } from 'rxjs';
import { SharedModule } from '../../shared/modules/shared.module';
import { PortfolioReviewModalComponent } from '../portfolio-review/portfolio-review-modal.component';
import { NotificationService } from '../../shared/services/notification.service';
import { selectAllSectors, selectSectorsLoading } from '../../store/stock-sector/stock-sector.selectors';
import { loadSectors } from '../../store/stock-sector/stock-sector.actions';
import { selectCurrentUser } from '../../store/auth/auth.selectors';
import { loadPortfolio } from '../../store/portfolio/portfolio.actions';
import {
  selectPortfolioLoading,
  selectPortfolioSummary,
} from '../../store/portfolio/portfolio.selectors';
import { AgentService } from '../../core/services/agent.service';
import { PortfolioReviewSignalRService } from '../../core/services/portfolio-review-signalr.service';
import { PortfolioReview } from '../../core/models/portfolio-review.models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit, OnDestroy {
  private readonly store = inject(Store);
  private readonly agentService = inject(AgentService);
  private readonly reviewSignalR = inject(PortfolioReviewSignalRService);
  private readonly notify = inject(NotificationService);
  private readonly dialog = inject(MatDialog);

  readonly currentUser$ = this.store.select(selectCurrentUser);
  readonly sectorCount$ = this.store.select(selectAllSectors).pipe(map((s) => s.length));
  readonly sectorsLoading$ = this.store.select(selectSectorsLoading);
  readonly portfolioLoading$ = this.store.select(selectPortfolioLoading);
  readonly portfolioSummary$ = this.store.select(selectPortfolioSummary);

  readonly topGainers$ = this.store.select(selectPortfolioSummary).pipe(
    map((s) =>
      [...(s?.holdings ?? [])].sort((a, b) => b.pnLPercent - a.pnLPercent).slice(0, 4)
    )
  );

  readonly topLosers$ = this.store.select(selectPortfolioSummary).pipe(
    map((s) =>
      [...(s?.holdings ?? [])].sort((a, b) => a.pnLPercent - b.pnLPercent).slice(0, 4)
    )
  );

  readonly gainerColumns = ['ticker', 'stock', 'ltp', 'return'];

  // Review state
  readonly reviewGenerating = signal(false);
  readonly latestReview = signal<PortfolioReview | null>(null);
  readonly unreadReviewCount = signal(0);

  private reviewSub?: Subscription;

  ngOnInit(): void {
    this.store.dispatch(loadSectors());
    this.store.dispatch(loadPortfolio());

    this.reviewSignalR.startConnection().catch(console.error);

    this.reviewSub = this.reviewSignalR.reviews$.subscribe((review) => {
      this.latestReview.set(review);
      this.unreadReviewCount.update((n) => n + 1);
      this.notify.info(
        'Portfolio Review Ready',
        'Your weekly review has been generated. Click the bell to view.',
      );
    });
  }

  ngOnDestroy(): void {
    this.reviewSub?.unsubscribe();
  }

  openReview(): void {
    this.unreadReviewCount.set(0);
    this.dialog.open(PortfolioReviewModalComponent, {
      data: this.latestReview(),
      width: '820px',
      maxWidth: '95vw',
      autoFocus: false,
    });
  }

  generateReview(): void {
    this.store.select(selectPortfolioSummary).pipe(
      take(1),
      map((s) => (s?.holdings ?? []).map((h) => h.ticker)),
    ).subscribe((tickers) => {
      if (!tickers.length) {
        this.notify.warn(
          'No Holdings',
          'Add holdings to your portfolio before generating a review.',
        );
        return;
      }

      this.reviewGenerating.set(true);

      this.agentService.runPortfolioReview({ tickers }).subscribe({
        next: (res) => {
          this.reviewGenerating.set(false);
          this.notify.success('Review Queued', res.message);
        },
        error: () => {
          this.reviewGenerating.set(false);
          this.notify.error(
            'Review Failed',
            'Could not generate the portfolio review. Please try again.',
          );
        },
      });
    });
  }
}
