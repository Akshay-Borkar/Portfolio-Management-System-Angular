import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageModule } from 'primeng/message';
import { SentimentService } from '../../core/services/sentiment.service';
import { SentimentResult } from '../../core/models/sentiment.models';

@Component({
  selector: 'app-sentiment',
  standalone: true,
  imports: [
    FormsModule, NgClass,
    CardModule, ButtonModule, InputTextModule, TableModule,
    TagModule, ProgressSpinnerModule, MessageModule,
  ],
  template: `
    <h2>News Sentiment Analysis</h2>

    <div class="flex gap-2 mb-4" style="max-width:400px">
      <input
        pInputText
        [(ngModel)]="ticker"
        placeholder="Enter ticker (e.g. AAPL)"
        (keydown.enter)="onAnalyze()"
        style="flex:1"
      />
      <p-button
        label="Analyze"
        icon="pi pi-search"
        [loading]="loading"
        (onClick)="onAnalyze()"
        [disabled]="!ticker.trim()"
      />
    </div>

    @if (error) {
      <p-message severity="error" [text]="error" styleClass="mb-3" />
    }

    @if (loading) {
      <div class="flex justify-content-center py-5"><p-progressSpinner /></div>
    }

    @if (results.length > 0) {
      <p-card [header]="'News for ' + analyzedTicker">
        <p-table [value]="results" [paginator]="results.length > 10" [rows]="10">
          <ng-template pTemplate="header">
            <tr>
              <th>Article</th>
              <th style="width:120px">Sentiment</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-item>
            <tr>
              <td>{{ item.article }}</td>
              <td>
                <p-tag
                  [value]="item.sentiment"
                  [styleClass]="getSentimentClass(item.sentiment)"
                />
              </td>
            </tr>
          </ng-template>
        </p-table>
      </p-card>
    }

    @if (!loading && results.length === 0 && analyzedTicker) {
      <div class="text-center text-color-secondary py-4">
        No news articles found for "{{ analyzedTicker }}".
      </div>
    }
  `,
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
