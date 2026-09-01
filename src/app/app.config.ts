import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import { provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideNativeDateAdapter } from '@angular/material/core';
import { provideStore, Store } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { firstValueFrom } from 'rxjs';
import { MSAL_GUARD_CONFIG, MSAL_INSTANCE, MSAL_INTERCEPTOR_CONFIG, MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { environment } from '../environments/environment';
import { routes } from './app.routes';
import { authInterceptor } from './core/auth/auth.interceptor';
import { MSALGuardConfigFactory, MSALInstanceFactory, MSALInterceptorConfigFactory, isAzureAdConfigured } from './core/auth/msal.config';
import { authReducer } from './store/auth/auth.reducer';
import { AuthEffects } from './store/auth/auth.effects';
import { stockSectorReducer } from './store/stock-sector/stock-sector.reducer';
import { StockSectorEffects } from './store/stock-sector/stock-sector.effects';
import { portfolioReducer } from './store/portfolio/portfolio.reducer';
import { PortfolioEffects } from './store/portfolio/portfolio.effects';
import { NotificationEffects } from './store/notification/notification.effects';
import { alertReducer } from './store/alert/alert.reducer';
import { AlertEffects } from './store/alert/alert.effects';
import { loadUserFromStorage, loginWithMicrosoftRedirectReturned } from './store/auth/auth.actions';
import { ThemeService } from './core/services/theme.service';

function initializeApp(store: Store, theme: ThemeService, msalService: MsalService) {
  return async () => {
    theme.init();
    store.dispatch(loadUserFromStorage());
    // MSAL Browser v3+ requires an explicit async initialize() before first use. Harmless to
    // call even when Azure AD isn't configured yet — msal.config.ts falls back to placeholder
    // values so this never throws; the "Sign in with Microsoft" button just stays disabled
    // (see isAzureAdConfigured()) until real values are filled in.
    if (isAzureAdConfigured()) {
      await firstValueFrom(msalService.initialize());
      // Login uses the redirect flow (see auth.effects.ts) — the whole page navigates to Entra
      // and back, so this same initializer runs again on the reload that carries the response.
      // handleRedirectObservable() picks that response out of the URL; if there is one, hand its
      // access token off to the effect that does the exchange + dispatches loginSuccess. Resolves
      // null on a normal page load with nothing to handle, so this is safe to always call.
      const result = await firstValueFrom(msalService.handleRedirectObservable());
      if (result) {
        store.dispatch(loginWithMicrosoftRedirectReturned({ accessToken: result.accessToken }));
      }
    }
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimationsAsync(),
    provideNativeDateAdapter(),
    provideStore({
      auth: authReducer,
      stockSector: stockSectorReducer,
      portfolio: portfolioReducer,
      alert: alertReducer,
    }),
    provideEffects([AuthEffects, StockSectorEffects, PortfolioEffects, AlertEffects, NotificationEffects]),
    provideStoreDevtools({ maxAge: 25, logOnly: environment.production }),
    { provide: JWT_OPTIONS, useValue: {} },
    JwtHelperService,
    // MsalInterceptor is deliberately NOT registered — authInterceptor above stays the single
    // source of truth for every normal request. MSAL is only ever consulted directly by the
    // loginWithMicrosoft$ effect (see store/auth/auth.effects.ts).
    { provide: MSAL_INSTANCE, useFactory: MSALInstanceFactory },
    { provide: MSAL_GUARD_CONFIG, useFactory: MSALGuardConfigFactory },
    { provide: MSAL_INTERCEPTOR_CONFIG, useFactory: MSALInterceptorConfigFactory },
    MsalService,
    MsalBroadcastService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [Store, ThemeService, MsalService],
      multi: true,
    },
  ],
};
