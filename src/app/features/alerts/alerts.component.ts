import { Component, OnInit, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { SharedModule } from '../../shared/modules/shared.module';
import { selectAllAlerts, selectAlertLoading } from '../../store/alert/alert.selectors';
import * as AlertActions from '../../store/alert/alert.actions';
import { AlertDTO, CreateAlertRequest } from '../../core/models/alert.models';

@Component({
  selector: 'app-alerts',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './alerts.component.html',
  styleUrl: './alerts.component.css',
})
export class AlertsComponent implements OnInit {
  private readonly store = inject(Store);

  readonly alerts$ = this.store.select(selectAllAlerts);
  readonly loading$ = this.store.select(selectAlertLoading);

  showDialog = false;
  form: CreateAlertRequest = { ticker: '', condition: 'Above', targetPrice: 0 };

  conditionOptions = [
    { label: 'Above', value: 'Above' },
    { label: 'Below', value: 'Below' },
  ];

  ngOnInit(): void {
    this.store.dispatch(AlertActions.loadAlerts());
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

  deleteAlert(alert: AlertDTO): void {
    this.store.dispatch(AlertActions.deleteAlert({ alertId: alert.id }));
  }
}
