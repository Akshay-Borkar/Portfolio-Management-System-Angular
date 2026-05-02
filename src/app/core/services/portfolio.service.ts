import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  AddInvestmentRequest,
  AddStockRequest,
  InvestmentHistoryDTO,
  PortfolioSummaryDTO,
} from '../models/portfolio.models';
import { OhlcvBar } from '../models/stock-market-data.models';
import { PagedResult } from '../models/paged-result.models';

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

  getInvestmentsByStock(stockId: string, page = 1, pageSize = 5): Observable<PagedResult<InvestmentHistoryDTO>> {
    return this.http.get<PagedResult<InvestmentHistoryDTO>>(`${this.base}/investments/${stockId}`, {
      params: { page, pageSize },
    });
  }

  getChartData(ticker: string, interval: string, range: string): Observable<OhlcvBar[]> {
    return this.http.get<OhlcvBar[]>(
      `${this.base}/chart/${ticker}?interval=${interval}&range=${range}`
    );
  }
}
