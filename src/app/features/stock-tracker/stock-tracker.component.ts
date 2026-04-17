import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SharedModule } from '../../shared/modules/shared.module';
import { SignalRService } from '../../core/services/signalr.service';
import { PriceChartComponent } from './price-chart/price-chart.component';

@Component({
  selector: 'app-stock-tracker',
  standalone: true,
  imports: [SharedModule, PriceChartComponent],
  templateUrl: './stock-tracker.component.html',
  styleUrl: './stock-tracker.component.css',
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
