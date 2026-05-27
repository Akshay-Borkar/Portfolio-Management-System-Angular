import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { SharedModule } from '../../modules/shared.module';
import { selectCurrentUser } from '../../../store/auth/auth.selectors';
import { logout } from '../../../store/auth/auth.actions';
import { ThemeService } from '../../../core/services/theme.service';
import { PortfolioReviewSignalRService } from '../../../core/services/portfolio-review-signalr.service';
import { PortfolioReview } from '../../../core/models/portfolio-review.models';
import { PortfolioReviewModalComponent } from '../../../features/portfolio-review/portfolio-review-modal.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [SharedModule, PortfolioReviewModalComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit, OnDestroy {
  private readonly store = inject(Store);
  readonly themeService = inject(ThemeService);
  private readonly reviewSignalR = inject(PortfolioReviewSignalRService);

  readonly currentUser$ = this.store.select(selectCurrentUser);
  menuItems: MenuItem[] = [];

  readonly unreadCount = signal(0);
  readonly reviewModalVisible = signal(false);
  readonly latestReview = signal<PortfolioReview | null>(null);

  private reviewSub?: Subscription;

  ngOnInit(): void {
    this.menuItems = [
      { label: 'Dashboard', icon: 'pi pi-home', routerLink: '/dashboard' },
      { label: 'Portfolio', icon: 'pi pi-wallet', routerLink: '/portfolio' },
      { label: 'Sectors', icon: 'pi pi-th-large', routerLink: '/sectors' },
      { label: 'Tracker', icon: 'pi pi-chart-line', routerLink: '/tracker' },
      { label: 'Sentiment', icon: 'pi pi-comments', routerLink: '/sentiment' },
      { label: 'Alerts', icon: 'pi pi-bell', routerLink: '/alerts' },
      { label: 'AI Chat', icon: 'pi pi-sparkles', routerLink: '/chat' },
      { label: 'Rebalancing Agent', icon: 'pi pi-sliders-h', routerLink: '/rebalancing-agent' },
    ];

    this.reviewSub = this.reviewSignalR.reviews$.subscribe((review) => {
      this.latestReview.set(review);
      this.unreadCount.update((n) => n + 1);
    });
  }

  ngOnDestroy(): void {
    this.reviewSub?.unsubscribe();
  }

  openReview(): void {
    this.unreadCount.set(0);
    this.reviewModalVisible.set(true);
  }

  onLogout(): void {
    this.store.dispatch(logout());
  }
}
