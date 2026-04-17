import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AsyncPipe, KeyValuePipe, DecimalPipe } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { BadgeModule } from 'primeng/badge';
import { TagModule } from 'primeng/tag';
import { Subscription } from 'rxjs';
import { SignalRService } from '../../core/services/signalr.service';
import { PriceChartComponent } from './price-chart/price-chart.component';

@Component({
  selector: 'app-stock-tracker',
  standalone: true,
  imports: [
    FormsModule, AsyncPipe, KeyValuePipe, DecimalPipe,
    CardModule, ButtonModule, InputTextModule, BadgeModule, TagModule,
    PriceChartComponent,
  ],
  template: `
    <h2>Live Stock Tracker</h2>

    <div class="flex gap-2 mb-4" style="max-width:400px">
      <input
        pInputText
        [(ngModel)]="tickerInput"
        placeholder="Enter ticker (e.g. CDSL.NS)"
        (keydown.enter)="onSubscribe()"
        style="flex:1"
      />
      <p-button label="Subscribe" icon="pi pi-plus" (onClick)="onSubscribe()" />
    </div>

    @if (subscribedTickers.size === 0) {
      <div class="text-color-secondary text-center py-5">
        <i class="pi pi-chart-line text-5xl block mb-2"></i>
        No stocks subscribed yet. Enter a ticker above to start.
      </div>
    }

    <div class="grid">
      @for (entry of subscribedTickers | keyvalue; track entry.key) {
        <div class="col-12 md:col-6 lg:col-4">
          <p-card>
            <ng-template pTemplate="header">
              <div class="flex justify-content-between align-items-center px-3 pt-2">
                <span class="font-bold text-lg">{{ entry.key }}</span>
                <p-button
                  icon="pi pi-times"
                  severity="danger"
                  [rounded]="true"
                  [text]="true"
                  size="small"
                  (onClick)="onUnsubscribe(entry.key)"
                />
              </div>
            </ng-template>
            <div class="text-2xl font-bold mb-3">
              {{ entry.value !== null ? (entry.value | number:'1.2-2') : '—' }}
              <p-tag
                [value]="entry.value !== null ? 'LIVE' : 'WAITING'"
                [severity]="entry.value !== null ? 'success' : 'warn'"
                styleClass="ml-2 text-xs"
              />
            </div>
            <app-price-chart [ticker]="entry.key" />
          </p-card>
        </div>
      }
    </div>
  `,
})
export class StockTrackerComponent implements OnInit, OnDestroy {
  private readonly signalRService = inject(SignalRService);
  private sub!: Subscription;

  tickerInput = '';
  subscribedTickers = new Map<string, number | null>();

  ngOnInit(): void {
    this.sub = this.signalRService.priceUpdates$.subscribe((update) => {
      if (this.subscribedTickers.has(update.symbol)) {
        this.subscribedTickers.set(update.symbol, update.price);
      }
    });
  }

  onSubscribe(): void {
    const ticker = this.tickerInput.trim().toUpperCase();
    if (!ticker || this.subscribedTickers.has(ticker)) return;
    this.subscribedTickers.set(ticker, null);
    this.signalRService.subscribeToStock(ticker);
    this.tickerInput = '';
  }

  onUnsubscribe(ticker: string): void {
    this.subscribedTickers.delete(ticker);
    this.signalRService.unsubscribeFromStock(ticker);
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
