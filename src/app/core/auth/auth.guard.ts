import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AppRoutes, StorageKeys } from '../constants/app.constants';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const jwtHelper = inject(JwtHelperService);
  const token = localStorage.getItem(StorageKeys.Token);

  if (token && !jwtHelper.isTokenExpired(token)) {
    return true;
  }

  localStorage.removeItem(StorageKeys.Token);
  return router.createUrlTree([AppRoutes.Login]);
};
