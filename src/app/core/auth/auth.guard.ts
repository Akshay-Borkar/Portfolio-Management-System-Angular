import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const jwtHelper = inject(JwtHelperService);
  const token = localStorage.getItem('stockmarket_token');

  if (token && !jwtHelper.isTokenExpired(token)) {
    return true;
  }

  localStorage.removeItem('stockmarket_token');
  return router.createUrlTree(['/login']);
};
