import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SentimentResult } from '../models/sentiment.models';

@Injectable({ providedIn: 'root' })
export class SentimentService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/api/sentiment`;

  analyzeNews(ticker: string): Observable<SentimentResult[]> {
    return this.http.get<SentimentResult[]>(
      `${this.base}/analyze-yahoo-news/${encodeURIComponent(ticker)}`
    );
  }
}
