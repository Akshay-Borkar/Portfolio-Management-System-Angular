import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  AddInvestmentRequest,
  AddStockRequest,
  PortfolioSummaryDTO,
} from '../models/portfolio.models';

@Injectable({ providedIn: 'root' })
export class PortfolioService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/api/portfolio`;

  getSummary(): Observable<PortfolioSummaryDTO> {
    return this.http.get<PortfolioSummaryDTO>(`${this.base}/summary`);
  }

  addStock(body: AddStockRequest): Observable<{ id: string }> {
    return this.http.post<{ id: string }>(`${this.base}/stock`, body);
  }

  addInvestment(body: AddInvestmentRequest): Observable<{ id: string }> {
    return this.http.post<{ id: string }>(`${this.base}/investment`, body);
  }
}
