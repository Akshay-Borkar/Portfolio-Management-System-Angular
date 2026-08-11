import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { MsalService } from '@azure/msal-angular';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/auth/auth.service';
import { SignalRService } from '../../core/services/signalr.service';
import * as AuthActions from './auth.actions';

@Injectable()
export class AuthEffects {
  private readonly actions$ = inject(Actions);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly signalRService = inject(SignalRService);
  private readonly msalService = inject(MsalService);

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap(({ request }) =>
        this.authService.login(request).pipe(
          map((response) => AuthActions.loginSuccess({ response })),
          catchError((err) =>
            of(AuthActions.loginFailure({ error: err?.error?.message ?? 'Login failed' }))
          )
        )
      )
    )
  );

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(() => {
          this.signalRService.startConnection().catch(console.error);
          this.router.navigate(['/dashboard']);
        })
      ),
    { dispatch: false }
  );

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.register),
      switchMap(({ request }) =>
        this.authService.register(request).pipe(
          map((res) => AuthActions.registerSuccess({ userId: res.userId })),
          catchError((err) =>
            of(AuthActions.registerFailure({ error: err?.error?.message ?? 'Registration failed' }))
          )
        )
      )
    )
  );

  registerSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.registerSuccess),
        tap(() => this.router.navigate(['/login']))
      ),
    { dispatch: false }
  );

  // Navigates the whole page away to Microsoft — no popup, no cross-window monitoring. The
  // browser leaves this app entirely, so nothing meaningful runs after loginRedirect() call;
  // the return trip is handled separately by loginWithMicrosoftRedirectReturned$ below, fired
  // from app.config.ts's bootstrap initializer once the app reloads with Entra's response.
  loginWithMicrosoft$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginWithMicrosoft),
        tap(() => {
          this.msalService
            .loginRedirect({ scopes: [environment.azureAd.apiScope] })
            .subscribe({ error: (err) => console.error('Microsoft sign-in redirect failed:', err) });
        })
      ),
    { dispatch: false }
  );

  // Raw Entra access token (from the redirect return trip) -> exchange for our own local JWT ->
  // reuse the exact same loginSuccess action a password login dispatches, so auth.reducer.ts
  // needs no changes: the SPA only ever has one kind of token in storage from this point on.
  loginWithMicrosoftRedirectReturned$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginWithMicrosoftRedirectReturned),
      switchMap(({ accessToken }) =>
        this.authService.exchangeExternalToken(accessToken).pipe(
          map((response) => AuthActions.loginSuccess({ response })),
          catchError((err) => {
            console.error('Microsoft sign-in exchange failed:', err);
            const message = err?.error?.message || err?.message || 'Microsoft sign-in failed';
            return of(AuthActions.loginFailure({ error: message }));
          })
        )
      )
    )
  );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => {
          this.signalRService.stopConnection().catch(console.error);
          // Also end the Microsoft session when the current one came from Entra External ID —
          // otherwise a silent SSO would just sign the user straight back in on the next
          // "Sign in with Microsoft" click. logoutRedirect navigates away, so nothing after
          // this call in the current page matters.
          if (this.msalService.instance.getActiveAccount()) {
            this.msalService.logoutRedirect().subscribe({ error: console.error });
          } else {
            this.router.navigate(['/login']);
          }
        })
      ),
    { dispatch: false }
  );
}
