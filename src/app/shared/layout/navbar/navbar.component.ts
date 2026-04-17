import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { MenuItem } from 'primeng/api';
import { SharedModule } from '../../modules/shared.module';
import { selectCurrentUser } from '../../../store/auth/auth.selectors';
import { logout } from '../../../store/auth/auth.actions';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  private readonly store = inject(Store);

  readonly currentUser$ = this.store.select(selectCurrentUser);
  menuItems: MenuItem[] = [];

  ngOnInit(): void {
    this.menuItems = [
      { label: 'Dashboard', icon: 'pi pi-home', routerLink: '/dashboard' },
      { label: 'Portfolio', icon: 'pi pi-wallet', routerLink: '/portfolio' },
      { label: 'Sectors', icon: 'pi pi-th-large', routerLink: '/sectors' },
      { label: 'Tracker', icon: 'pi pi-chart-line', routerLink: '/tracker' },
      { label: 'Sentiment', icon: 'pi pi-comments', routerLink: '/sentiment' },
    ];
  }

  onLogout(): void {
    this.store.dispatch(logout());
  }
}
