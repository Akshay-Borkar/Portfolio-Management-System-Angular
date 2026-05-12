import { Injectable, signal } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LivePriceUpdate } from '../models/stock-market-data.models';

export type ConnectionState = 'connected' | 'connecting' | 'reconnecting' | 'disconnected';

@Injectable({ providedIn: 'root' })
export class SignalRService {
  readonly priceUpdates$ = new Subject<LivePriceUpdate>();
  readonly connectionState = signal<ConnectionState>('disconnected');

  private connection: signalR.HubConnection | null = null;

  private buildConnection(): signalR.HubConnection {
    return new signalR.HubConnectionBuilder()
      .withUrl(environment.signalrHubUrl, {
        accessTokenFactory: () =>
          localStorage.getItem('stockmarket_token') ?? '',
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Warning)
      .build();
  }

  async startConnection(): Promise<void> {
    if (this.connection) return;

    this.connection = this.buildConnection();

    this.connection.on(
      'ReceiveStockPrice',
      (symbol: string, price: number) => {
        this.priceUpdates$.next({ symbol, price });
      }
    );

    this.connection.onreconnecting(() => this.connectionState.set('reconnecting'));
    this.connection.onreconnected(() => this.connectionState.set('connected'));
    this.connection.onclose(() => this.connectionState.set('disconnected'));

    this.connectionState.set('connecting');
    await this.connection.start();
    this.connectionState.set('connected');
  }

  async stopConnection(): Promise<void> {
    if (!this.connection) return;
    await this.connection.stop();
    this.connection = null;
  }

  subscribeToStock(ticker: string): void {
    this.connection?.invoke('SubscribeToStock', ticker).catch(console.error);
  }

  unsubscribeFromStock(ticker: string): void {
    this.connection?.invoke('UnsubscribeFromStock', ticker).catch(console.error);
  }
}
