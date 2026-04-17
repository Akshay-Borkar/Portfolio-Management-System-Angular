import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { AsyncPipe } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { map } from 'rxjs';
import { selectAllSectors } from '../../store/stock-sector/stock-sector.selectors';
import { loadSectors } from '../../store/stock-sector/stock-sector.actions';
import { selectCurrentUser } from '../../store/auth/auth.selectors';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, AsyncPipe, CardModule, ButtonModule],
  template: `
    <h2>Welcome back, {{ (currentUser$ | async)?.userName }} 👋</h2>
    <div class="grid mt-3">
      <div class="col-12 md:col-4">
        <p-card>
          <div class="flex align-items-center gap-3">
            <i class="pi pi-th-large text-4xl" style="color: var(--primary-color)"></i>
            <div>
              <div class="text-3xl font-bold">{{ sectorCount$ | async }}</div>
              <div class="text-color-secondary">Stock Sectors</div>
            </div>
          </div>
          <ng-template pTemplate="footer">
            <p-button label="Manage Sectors" routerLink="/sectors" size="small" />
          </ng-template>
        </p-card>
      </div>
      <div class="col-12 md:col-4">
        <p-card>
          <div class="flex align-items-center gap-3">
            <i class="pi pi-chart-line text-4xl" style="color: var(--green-500)"></i>
            <div>
              <div class="text-3xl font-bold">Live</div>
              <div class="text-color-secondary">Price Tracker</div>
            </div>
          </div>
          <ng-template pTemplate="footer">
            <p-button label="Open Tracker" routerLink="/tracker" severity="success" size="small" />
          </ng-template>
        </p-card>
      </div>
      <div class="col-12 md:col-4">
        <p-card>
          <div class="flex align-items-center gap-3">
            <i class="pi pi-comments text-4xl" style="color: var(--yellow-500)"></i>
            <div>
              <div class="text-3xl font-bold">AI</div>
              <div class="text-color-secondary">News Sentiment</div>
            </div>
          </div>
          <ng-template pTemplate="footer">
            <p-button label="Analyze News" routerLink="/sentiment" severity="warn" size="small" />
          </ng-template>
        </p-card>
      </div>
    </div>
  `,
})
export class DashboardComponent implements OnInit {
  private readonly store = inject(Store);

  readonly currentUser$ = this.store.select(selectCurrentUser);
  readonly sectorCount$ = this.store.select(selectAllSectors).pipe(map((s) => s.length));

  ngOnInit(): void {
    this.store.dispatch(loadSectors());
  }
}
