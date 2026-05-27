import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { RunReviewRequest, RunReviewResponse } from '../models/portfolio-review.models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AgentService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.agentApiUrl}/api/agents`;

  runPortfolioReview(request: RunReviewRequest): Observable<RunReviewResponse> {
    return this.http.post<RunReviewResponse>(`${this.base}/run-portfolio-review`, request);
  }
}
