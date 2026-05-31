import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { RunReviewRequest, RunReviewResponse } from '../models/portfolio-review.models';
import { environment } from '../../../environments/environment';
import { ApiEndpoints } from '../constants/app.constants';

@Injectable({ providedIn: 'root' })
export class AgentService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.agentApiUrl}${ApiEndpoints.Agents.Base}`;

  runPortfolioReview(request: RunReviewRequest): Observable<RunReviewResponse> {
    return this.http.post<RunReviewResponse>(`${this.base}${ApiEndpoints.Agents.RunPortfolioReview}`, request);
  }
}
