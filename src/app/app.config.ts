import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import { provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { provideStore, Store } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../environments/environment';
import { routes } from './app.routes';
import { authInterceptor } from './core/auth/auth.interceptor';
import { authReducer } from './store/auth/auth.reducer';
import { AuthEffects } from './store/auth/auth.effects';
import { stockSectorReducer } from './store/stock-sector/stock-sector.reducer';
import { StockSectorEffects } from './store/stock-sector/stock-sector.effects';
import { portfolioReducer } from './store/portfolio/portfolio.reducer';
import { PortfolioEffects } from './store/portfolio/portfolio.effects';
import { loadUserFromStorage } from './store/auth/auth.actions';

function initializeApp(store: Store) {
  return () => store.dispatch(loadUserFromStorage());
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimationsAsync(),
    providePrimeNG({ theme: { preset: Aura, options: { darkModeSelector: '.dark-mode', cssLayer: false } } }),
    provideStore({
      auth: authReducer,
      stockSector: stockSectorReducer,
      portfolio: portfolioReducer,
    }),
    provideEffects([AuthEffects, StockSectorEffects, PortfolioEffects]),
    provideStoreDevtools({ maxAge: 25, logOnly: environment.production }),
    { provide: JWT_OPTIONS, useValue: {} },
    JwtHelperService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [Store],
      multi: true,
    },
  ],
};
