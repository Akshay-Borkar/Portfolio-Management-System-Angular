import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '../models/auth.models';
import { ApiEndpoints } from '../constants/app.constants';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}${ApiEndpoints.Auth.Base}`;

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.base}${ApiEndpoints.Auth.Login}`, request);
  }

  register(request: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.base}${ApiEndpoints.Auth.Register}`, request);
  }

  /**
   * Exchanges a raw Microsoft Entra External ID access token (already acquired via MSAL) for
   * this app's own local JWT — see Identity's POST /api/auth/external/login. The Entra token is
   * attached explicitly here rather than via authInterceptor, which is excluded from this one
   * URL specifically so it doesn't overwrite this header with the stored local token instead.
   */
  exchangeExternalToken(azureAdAccessToken: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${this.base}${ApiEndpoints.Auth.ExternalLogin}`,
      null,
      { headers: { Authorization: `Bearer ${azureAdAccessToken}` } }
    );
  }
}
