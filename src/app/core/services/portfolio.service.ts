import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Observer } from 'rxjs';
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

  deleteStock(stockId: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/stock/${stockId}`);
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

  streamRebalancingChat(message: string, sessionId: string): Observable<string> {
    return new Observable<string>((observer: Observer<string>) => {
      const token = localStorage.getItem('stockmarket_token') ?? '';

      fetch(`${this.base}/ai/rebalancing/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ message, sessionId }),
      })
        .then(async (response) => {
          const reader = response.body!.getReader();
          const decoder = new TextDecoder();
          let buffer = '';

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() ?? '';

            for (const line of lines) {
              if (!line.startsWith('data: ')) continue;
              const content = line.slice(6);
              if (content === '[DONE]') {
                observer.complete();
                return;
              }
              if (content) {
                observer.next(content);
              }
            }
          }

          observer.complete();
        })
        .catch((err) => observer.error(err));
    });
  }

  clearRebalancingSession(sessionId: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/ai/rebalancing/session/${sessionId}`);
  }

  streamChat(message: string): Observable<string> {
    return new Observable<string>((observer: Observer<string>) => {
      const token = localStorage.getItem('stockmarket_token') ?? '';

      fetch(`${this.base}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ message }),
      })
        .then(async (response) => {
          const reader = response.body!.getReader();
          const decoder = new TextDecoder();
          let buffer = '';

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() ?? '';

            for (const line of lines) {
              if (!line.startsWith('data: ')) continue;
              const content = line.slice(6);
              if (content === '[DONE]') {
                observer.complete();
                return;
              }
              if (content) {
                observer.next(content);
              }
            }
          }

          observer.complete();
        })
        .catch((err) => observer.error(err));
    });
  }
}
