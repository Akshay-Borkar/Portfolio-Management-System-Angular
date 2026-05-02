import { Component, OnInit, inject } from '@angular/core';
import { PaginatorState } from 'primeng/paginator';
import { Store } from '@ngrx/store';
import { ConfirmationService } from 'primeng/api';
import { SharedModule } from '../../shared/modules/shared.module';
import {
  selectAllAlerts,
  selectAlertLoading,
  selectAlertTotalCount,
  selectAlertPage,
  selectAlertPageSize,
} from '../../store/alert/alert.selectors';
import * as AlertActions from '../../store/alert/alert.actions';
import { AlertDTO, CreateAlertRequest } from '../../core/models/alert.models';

@Component({
  selector: 'app-alerts',
  standalone: true,
  imports: [SharedModule],
  providers: [ConfirmationService],
  templateUrl: './alerts.component.html',
  styleUrl: './alerts.component.css',
})
export class AlertsComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly confirmationService = inject(ConfirmationService);

  readonly alerts$ = this.store.select(selectAllAlerts);
  readonly loading$ = this.store.select(selectAlertLoading);
  readonly totalCount$ = this.store.select(selectAlertTotalCount);
  readonly page$ = this.store.select(selectAlertPage);
  readonly pageSize$ = this.store.select(selectAlertPageSize);

  showDialog = false;
  form: CreateAlertRequest = { ticker: '', condition: 'Above', targetPrice: 0 };

  conditionOptions = [
    { label: 'Above', value: 'Above' },
    { label: 'Below', value: 'Below' },
  ];

  ngOnInit(): void {
    this.store.dispatch(AlertActions.loadAlerts({}));
  }

  openDialog(): void {
    this.form = { ticker: '', condition: 'Above', targetPrice: 0 };
    this.showDialog = true;
  }

  submit(): void {
    if (!this.form.ticker.trim() || !this.form.targetPrice) return;
    this.store.dispatch(AlertActions.createAlert({ request: { ...this.form, ticker: this.form.ticker.toUpperCase() } }));
    this.showDialog = false;
  }

  onPageChange(event: PaginatorState): void {
    const first = event.first ?? 0;
    const rows = event.rows ?? 10;
    const page = Math.floor(first / rows) + 1;
    this.store.dispatch(AlertActions.loadAlerts({ page, pageSize: rows }));
  }

  deleteAlert(alert: AlertDTO): void {
    this.confirmationService.confirm({
      message: `Delete the <strong>${alert.ticker}</strong> alert (${alert.condition} ${alert.targetPrice})?`,
      header: 'Delete Alert',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Delete',
      rejectLabel: 'Cancel',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.store.dispatch(AlertActions.deleteAlert({ alertId: alert.id })),
    });
  }
}
