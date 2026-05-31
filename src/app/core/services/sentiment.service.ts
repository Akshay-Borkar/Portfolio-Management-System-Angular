import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SentimentResult } from '../models/sentiment.models';
import { ApiEndpoints } from '../constants/app.constants';

@Injectable({ providedIn: 'root' })
export class SentimentService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}${ApiEndpoints.Sentiment.Base}`;

  analyzeNews(ticker: string): Observable<SentimentResult[]> {
    return this.http.get<SentimentResult[]>(
      `${this.base}${ApiEndpoints.Sentiment.Analyze}/${encodeURIComponent(ticker)}`
    );
  }
}
