import { Component, ViewChild, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, switchMap } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
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
  private readonly analyze$ = new Subject<string>();

  ticker = '';
  analyzedTicker = '';
  results: SentimentResult[] = [];
  loading = false;
  error = '';

  readonly displayedColumns = ['article', 'sentiment'];
  readonly dataSource = new MatTableDataSource<SentimentResult>([]);

  @ViewChild(MatPaginator) set paginator(p: MatPaginator | undefined) {
    if (p) this.dataSource.paginator = p;
  }

  constructor() {
    this.analyze$.pipe(
      switchMap((t) => {
        this.loading = true;
        this.error = '';
        this.results = [];
        this.dataSource.data = [];
        this.analyzedTicker = t;
        return this.sentimentService.analyzeNews(t);
      }),
      takeUntilDestroyed()
    ).subscribe({
      next: (data) => {
        this.results = data;
        this.dataSource.data = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message ?? 'Failed to fetch news. Please try again.';
        this.loading = false;
      },
    });
  }

  onAnalyze(): void {
    const t = this.ticker.trim();
    if (!t) return;
    this.analyze$.next(t);
  }

  getSentimentClass(sentiment: string): string {
    const s = sentiment?.toLowerCase();
    if (s === 'positive') return 'sentiment-positive';
    if (s === 'negative') return 'sentiment-negative';
    if (s === 'neutral') return 'sentiment-neutral';
    return 'sentiment-unknown';
  }
}
