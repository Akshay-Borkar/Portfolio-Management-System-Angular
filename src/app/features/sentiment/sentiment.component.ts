import { Component, inject } from '@angular/core';
import { SharedModule } from '../../shared/modules/shared.module';
import { SentimentService } from '../../core/services/sentiment.service';
import { SentimentResult } from '../../core/models/sentiment.models';

@Component({
  selector: 'app-sentiment',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './sentiment.component.html',
  styleUrl: './sentiment.component.css',
})
export class SentimentComponent {
  private readonly sentimentService = inject(SentimentService);

  ticker = '';
  analyzedTicker = '';
  results: SentimentResult[] = [];
  loading = false;
  error = '';

  onAnalyze(): void {
    const t = this.ticker.trim();
    if (!t) return;
    this.loading = true;
    this.error = '';
    this.results = [];
    this.analyzedTicker = t;

    this.sentimentService.analyzeNews(t).subscribe({
      next: (data) => {
        this.results = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message ?? 'Failed to fetch news. Please try again.';
        this.loading = false;
      },
    });
  }

  getSentimentClass(sentiment: string): string {
    const s = sentiment?.toLowerCase();
    if (s === 'positive') return 'sentiment-positive';
    if (s === 'negative') return 'sentiment-negative';
    if (s === 'neutral') return 'sentiment-neutral';
    return 'sentiment-unknown';
  }
}
