import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { catchError, throwError } from 'rxjs';
import { logout } from '../../store/auth/auth.actions';
import { ApiEndpoints, AppRoutes, HttpStatusCodes, StorageKeys } from '../constants/app.constants';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const store = inject(Store);

  // The one exception: AuthService.exchangeExternalToken sets its own Authorization header
  // with a raw Azure AD access token (there's no local token yet on a first-ever AAD sign-in).
  // Attaching the stored local token here too would silently overwrite that header.
  const isExternalLoginExchange = req.url.endsWith(`${ApiEndpoints.Auth.Base}${ApiEndpoints.Auth.ExternalLogin}`);

  const token = isExternalLoginExchange ? null : localStorage.getItem(StorageKeys.Token);
  const cloned = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(cloned).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === HttpStatusCodes.Unauthorized || err.status === HttpStatusCodes.Forbidden) {
        store.dispatch(logout());
        router.navigate([AppRoutes.Login]);
      }
      return throwError(() => err);
    })
  );
};
