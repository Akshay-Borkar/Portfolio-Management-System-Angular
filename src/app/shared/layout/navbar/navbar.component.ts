import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { AsyncPipe } from '@angular/common';
import { selectCurrentUser } from '../../../store/auth/auth.selectors';
import { logout } from '../../../store/auth/auth.actions';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MenubarModule, ButtonModule, AsyncPipe],
  template: `
    <p-menubar [model]="menuItems">
      <ng-template pTemplate="start">
        <span class="font-bold text-lg mr-4" style="color: var(--primary-color)">
          📈 StockMarket
        </span>
      </ng-template>
      <ng-template pTemplate="end">
        <div class="flex align-items-center gap-2">
          <span class="text-sm text-color-secondary">
            {{ (currentUser$ | async)?.userName }}
          </span>
          <p-button
            label="Logout"
            severity="secondary"
            size="small"
            (onClick)="onLogout()"
          />
        </div>
      </ng-template>
    </p-menubar>
  `,
})
export class NavbarComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly router = inject(Router);

  readonly currentUser$ = this.store.select(selectCurrentUser);
  menuItems: MenuItem[] = [];

  ngOnInit(): void {
    this.menuItems = [
      { label: 'Dashboard', icon: 'pi pi-home', routerLink: '/dashboard' },
      { label: 'Sectors', icon: 'pi pi-th-large', routerLink: '/sectors' },
      { label: 'Tracker', icon: 'pi pi-chart-line', routerLink: '/tracker' },
      { label: 'Sentiment', icon: 'pi pi-comments', routerLink: '/sentiment' },
    ];
  }

  onLogout(): void {
    this.store.dispatch(logout());
  }
}
