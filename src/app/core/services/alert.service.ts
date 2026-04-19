import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AlertDTO, CreateAlertRequest } from '../models/alert.models';

@Injectable({ providedIn: 'root' })
export class AlertService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/api/alerts`;

  getAlerts(): Observable<AlertDTO[]> {
    return this.http.get<AlertDTO[]>(this.base);
  }

  createAlert(body: CreateAlertRequest): Observable<{ id: string }> {
    return this.http.post<{ id: string }>(this.base, body);
  }

  deleteAlert(alertId: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${alertId}`);
  }
}
