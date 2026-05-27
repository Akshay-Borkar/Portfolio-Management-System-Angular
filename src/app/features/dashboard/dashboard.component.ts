import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, Subscription, take } from 'rxjs';
import { MessageService } from 'primeng/api';
import { SharedModule } from '../../shared/modules/shared.module';
import { PortfolioReviewModalComponent } from '../portfolio-review/portfolio-review-modal.component';
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
  imports: [SharedModule, PortfolioReviewModalComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit, OnDestroy {
  private readonly store = inject(Store);
  private readonly agentService = inject(AgentService);
  private readonly reviewSignalR = inject(PortfolioReviewSignalRService);
  private readonly messageService = inject(MessageService);

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

  // Review state
  readonly reviewGenerating = signal(false);
  readonly reviewModalVisible = signal(false);
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
      this.messageService.add({
        severity: 'info',
        summary: 'Portfolio Review Ready',
        detail: 'Your weekly review has been generated. Click the bell to view.',
        life: 6000,
      });
    });
  }

  ngOnDestroy(): void {
    this.reviewSub?.unsubscribe();
  }

  openReview(): void {
    this.unreadReviewCount.set(0);
    this.reviewModalVisible.set(true);
  }

  generateReview(): void {
    this.store.select(selectPortfolioSummary).pipe(
      take(1),
      map((s) => (s?.holdings ?? []).map((h) => h.ticker)),
    ).subscribe((tickers) => {
      if (!tickers.length) {
        this.messageService.add({
          severity: 'warn',
          summary: 'No Holdings',
          detail: 'Add holdings to your portfolio before generating a review.',
          life: 4000,
        });
        return;
      }

      this.reviewGenerating.set(true);

      this.agentService.runPortfolioReview({ tickers }).subscribe({
        next: (res) => {
          this.reviewGenerating.set(false);
          this.messageService.add({
            severity: 'success',
            summary: 'Review Queued',
            detail: res.message,
            life: 5000,
          });
        },
        error: () => {
          this.reviewGenerating.set(false);
          this.messageService.add({
            severity: 'error',
            summary: 'Review Failed',
            detail: 'Could not generate the portfolio review. Please try again.',
            life: 5000,
          });
        },
      });
    });
  }
}
