import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { catchError, throwError } from 'rxjs';
import { logout } from '../../store/auth/auth.actions';
import { AppRoutes, HttpStatusCodes, StorageKeys } from '../constants/app.constants';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem(StorageKeys.Token);
  const router = inject(Router);
  const store = inject(Store);

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
