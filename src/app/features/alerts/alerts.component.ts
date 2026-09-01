import { Component, OnInit, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { SharedModule } from '../../shared/modules/shared.module';
import { ConfirmService } from '../../shared/services/confirm.service';
import {
  selectAllAlerts,
  selectAlertLoading,
  selectAlertTotalCount,
  selectAlertPage,
  selectAlertPageSize,
} from '../../store/alert/alert.selectors';
import * as AlertActions from '../../store/alert/alert.actions';
import { AlertDTO, CreateAlertRequest } from '../../core/models/alert.models';
import { AlertCreateDialogComponent } from './alert-create-dialog.component';

@Component({
  selector: 'app-alerts',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './alerts.component.html',
  styleUrl: './alerts.component.css',
})
export class AlertsComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly confirm = inject(ConfirmService);
  private readonly dialog = inject(MatDialog);

  readonly alerts$ = this.store.select(selectAllAlerts);
  readonly loading$ = this.store.select(selectAlertLoading);
  readonly totalCount$ = this.store.select(selectAlertTotalCount);
  readonly page$ = this.store.select(selectAlertPage);
  readonly pageSize$ = this.store.select(selectAlertPageSize);

  readonly displayedColumns = ['ticker', 'condition', 'targetPrice', 'status', 'created', 'actions'];

  ngOnInit(): void {
    this.store.dispatch(AlertActions.loadAlerts({}));
  }

  openDialog(): void {
    this.dialog
      .open<AlertCreateDialogComponent, unknown, CreateAlertRequest>(AlertCreateDialogComponent, {
        width: '26rem',
      })
      .afterClosed()
      .subscribe((request) => {
        if (request) this.store.dispatch(AlertActions.createAlert({ request }));
      });
  }

  onPageChange(event: PageEvent): void {
    this.store.dispatch(
      AlertActions.loadAlerts({ page: event.pageIndex + 1, pageSize: event.pageSize }),
    );
  }

  async deleteAlert(alert: AlertDTO): Promise<void> {
    const ok = await this.confirm.confirm({
      header: 'Delete Alert',
      message: `Delete the <strong>${alert.ticker}</strong> alert (${alert.condition} ${alert.targetPrice})?`,
      icon: 'warning',
      acceptTone: 'danger',
      acceptLabel: 'Delete',
    });
    if (ok) this.store.dispatch(AlertActions.deleteAlert({ alertId: alert.id }));
  }
}
