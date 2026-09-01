import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { SharedModule } from '../../modules/shared.module';
import { selectCurrentUser } from '../../../store/auth/auth.selectors';
import { logout } from '../../../store/auth/auth.actions';
import { ThemeService } from '../../../core/services/theme.service';
import { PortfolioReviewSignalRService } from '../../../core/services/portfolio-review-signalr.service';
import { PortfolioReview } from '../../../core/models/portfolio-review.models';
import { PortfolioReviewModalComponent } from '../../../features/portfolio-review/portfolio-review-modal.component';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [SharedModule, MatDialogModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit, OnDestroy {
  private readonly store = inject(Store);
  readonly themeService = inject(ThemeService);
  private readonly reviewSignalR = inject(PortfolioReviewSignalRService);
  private readonly dialog = inject(MatDialog);

  readonly currentUser$ = this.store.select(selectCurrentUser);

  readonly navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'home', route: '/dashboard' },
    { label: 'Portfolio', icon: 'account_balance_wallet', route: '/portfolio' },
    { label: 'Sectors', icon: 'grid_view', route: '/sectors' },
    { label: 'Tracker', icon: 'show_chart', route: '/tracker' },
    { label: 'Sentiment', icon: 'forum', route: '/sentiment' },
    { label: 'Alerts', icon: 'notifications', route: '/alerts' },
    { label: 'AI Chat', icon: 'auto_awesome', route: '/chat' },
    { label: 'Rebalancing Agent', icon: 'tune', route: '/rebalancing-agent' },
  ];

  readonly unreadCount = signal(0);
  readonly latestReview = signal<PortfolioReview | null>(null);

  private reviewSub?: Subscription;

  ngOnInit(): void {
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
    this.dialog.open(PortfolioReviewModalComponent, {
      data: this.latestReview(),
      width: '820px',
      maxWidth: '95vw',
      autoFocus: false,
    });
  }

  onLogout(): void {
    this.store.dispatch(logout());
  }
}
