import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { createChart, IChartApi, ISeriesApi, UTCTimestamp } from 'lightweight-charts';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { SignalRService } from '../../../core/services/signalr.service';

@Component({
  selector: 'app-price-chart',
  standalone: true,
  template: `<div #chartContainer style="width:100%; height:200px;"></div>`,
})
export class PriceChartComponent implements OnInit, OnDestroy {
  @Input({ required: true }) ticker!: string;
  @ViewChild('chartContainer', { static: true }) containerRef!: ElementRef<HTMLDivElement>;

  private readonly signalRService = inject(SignalRService);
  private chart!: IChartApi;
  private lineSeries!: ISeriesApi<'Line'>;
  private sub!: Subscription;

  ngOnInit(): void {
    this.chart = createChart(this.containerRef.nativeElement, {
      layout: {
        background: { color: 'transparent' },
        textColor: '#d1d5db',
      },
      grid: {
        vertLines: { color: '#374151' },
        horzLines: { color: '#374151' },
      },
      rightPriceScale: { borderColor: '#4b5563' },
      timeScale: { borderColor: '#4b5563', timeVisible: true },
    });

    this.lineSeries = this.chart.addLineSeries({
      color: '#6366f1',
      lineWidth: 2,
    });

    this.sub = this.signalRService.priceUpdates$
      .pipe(filter((u) => u.symbol === this.ticker))
      .subscribe((update) => {
        this.lineSeries.update({
          time: (Math.floor(Date.now() / 1000)) as UTCTimestamp,
          value: update.price,
        });
      });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    this.chart?.remove();
  }
}
