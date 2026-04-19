import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
  inject,
} from '@angular/core';
import {
  createChart,
  IChartApi,
  ISeriesApi,
  UTCTimestamp,
  CandlestickData,
} from 'lightweight-charts';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { SignalRService } from '../../../core/services/signalr.service';
import { PortfolioService } from '../../../core/services/portfolio.service';
import { CHART_INTERVALS, ChartInterval } from '../../../core/models/stock-market-data.models';
import { SharedModule } from '../../../shared/modules/shared.module';

@Component({
  selector: 'app-price-chart',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './price-chart.component.html',
  styleUrl: './price-chart.component.css',
})
export class PriceChartComponent implements OnInit, OnDestroy, OnChanges {
  @Input({ required: true }) ticker!: string;
  @ViewChild('chartContainer', { static: true }) containerRef!: ElementRef<HTMLDivElement>;

  private readonly signalRService = inject(SignalRService);
  private readonly portfolioService = inject(PortfolioService);

  private chart!: IChartApi;
  private candleSeries!: ISeriesApi<'Candlestick'>;
  private sub!: Subscription;

  readonly intervals = CHART_INTERVALS;
  selectedInterval: ChartInterval = CHART_INTERVALS[0];
  loading = false;
  lastClose = 0;

  ngOnInit(): void {
    this.initChart();
    this.loadHistory(this.selectedInterval);
    this.subscribeToLive();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['ticker'] && !changes['ticker'].firstChange) {
      this.loadHistory(this.selectedInterval);
    }
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    this.chart?.remove();
  }

  selectInterval(interval: ChartInterval): void {
    this.selectedInterval = interval;
    this.loadHistory(interval);
  }

  private initChart(): void {
    this.chart = createChart(this.containerRef.nativeElement, {
      layout: {
        background: { color: 'transparent' },
        textColor: '#9ca3af',
      },
      grid: {
        vertLines: { color: 'rgba(75, 85, 99, 0.3)' },
        horzLines: { color: 'rgba(75, 85, 99, 0.3)' },
      },
      rightPriceScale: { borderColor: '#374151' },
      timeScale: { borderColor: '#374151', timeVisible: true, secondsVisible: false },
      crosshair: { mode: 1 },
    });

    this.candleSeries = this.chart.addCandlestickSeries({
      upColor: '#22c55e',
      downColor: '#ef4444',
      borderUpColor: '#22c55e',
      borderDownColor: '#ef4444',
      wickUpColor: '#22c55e',
      wickDownColor: '#ef4444',
    });
  }

  private loadHistory(interval: ChartInterval): void {
    this.loading = true;
    this.portfolioService.getChartData(this.ticker, interval.interval, interval.range).subscribe({
      next: (bars) => {
        const data: CandlestickData[] = bars.map((b) => ({
          time: b.time as UTCTimestamp,
          open: b.open,
          high: b.high,
          low: b.low,
          close: b.close,
        }));
        this.candleSeries.setData(data);
        if (data.length > 0) {
          this.lastClose = data[data.length - 1].close as number;
        }
        this.chart.timeScale().fitContent();
        this.loading = false;
      },
      error: () => { this.loading = false; },
    });
  }

  private subscribeToLive(): void {
    this.sub = this.signalRService.priceUpdates$
      .pipe(filter((u) => u.symbol === this.ticker))
      .subscribe((update) => {
        const t = Math.floor(Date.now() / 1000) as UTCTimestamp;
        // Update the last candle's close with the live price
        const price = update.price;
        this.candleSeries.update({
          time: t,
          open: this.lastClose || price,
          high: Math.max(this.lastClose || price, price),
          low: Math.min(this.lastClose || price, price),
          close: price,
        });
        this.lastClose = price;
      });
  }
}
