import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: '',
    loadComponent: () =>
      import('./shared/layout/shell/shell.component').then((m) => m.ShellComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'sectors',
        loadComponent: () =>
          import('./features/stock-sectors/stock-sector-list/stock-sector-list.component').then(
            (m) => m.StockSectorListComponent
          ),
      },
      {
        path: 'sectors/:id',
        loadComponent: () =>
          import('./features/stock-sectors/stock-sector-detail/stock-sector-detail.component').then(
            (m) => m.StockSectorDetailComponent
          ),
      },
      {
        path: 'tracker',
        loadComponent: () =>
          import('./features/stock-tracker/stock-tracker.component').then(
            (m) => m.StockTrackerComponent
          ),
      },
      {
        path: 'sentiment',
        loadComponent: () =>
          import('./features/sentiment/sentiment.component').then((m) => m.SentimentComponent),
      },
      {
        path: 'portfolio',
        loadComponent: () =>
          import('./features/portfolio/portfolio.component').then((m) => m.PortfolioComponent),
      },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];
