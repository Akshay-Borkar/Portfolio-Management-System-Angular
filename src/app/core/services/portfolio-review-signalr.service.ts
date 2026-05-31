import { Injectable, signal } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Subject } from 'rxjs';
import { PortfolioReview } from '../models/portfolio-review.models';
import { environment } from '../../../environments/environment';
import { SignalRMethods, StorageKeys } from '../constants/app.constants';

@Injectable({ providedIn: 'root' })
export class PortfolioReviewSignalRService {
  readonly reviews$ = new Subject<PortfolioReview>();
  readonly isConnected = signal(false);

  private connection: signalR.HubConnection | null = null;

  private buildConnection(): signalR.HubConnection {
    return new signalR.HubConnectionBuilder()
      .withUrl(environment.portfolioReviewHubUrl, {
        accessTokenFactory: () => localStorage.getItem(StorageKeys.Token) ?? '',
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Warning)
      .build();
  }

  async startConnection(): Promise<void> {
    if (this.connection) return;

    this.connection = this.buildConnection();

    this.connection.on(SignalRMethods.ReceivePortfolioReview, (review: PortfolioReview) => {
      console.log('[PortfolioReviewSignalR] ReceivePortfolioReview received:', review);
      this.reviews$.next(review);
    });

    this.connection.onreconnected(() => this.isConnected.set(true));
    this.connection.onclose(() => {
      console.log('[PortfolioReviewSignalR] connection closed');
      this.isConnected.set(false);
    });

    await this.connection.start();
    console.log('[PortfolioReviewSignalR] connection established, state:', this.connection.state);
    this.isConnected.set(true);
  }

  async stopConnection(): Promise<void> {
    if (!this.connection) return;
    await this.connection.stop();
    this.connection = null;
    this.isConnected.set(false);
  }
}
