import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AlertDTO, CreateAlertRequest } from '../models/alert.models';
import { PagedResult } from '../models/paged-result.models';

@Injectable({ providedIn: 'root' })
export class AlertService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/api/alerts`;

  getAlerts(page = 1, pageSize = 10): Observable<PagedResult<AlertDTO>> {
    return this.http.get<PagedResult<AlertDTO>>(this.base, {
      params: { page, pageSize },
    });
  }

  createAlert(body: CreateAlertRequest): Observable<{ id: string }> {
    return this.http.post<{ id: string }>(this.base, body);
  }

  deleteAlert(alertId: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${alertId}`);
  }
}
