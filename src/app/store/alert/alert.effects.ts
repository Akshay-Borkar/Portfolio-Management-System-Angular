import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { AlertService } from '../../core/services/alert.service';
import * as AlertActions from './alert.actions';

@Injectable()
export class AlertEffects {
  private readonly actions$ = inject(Actions);
  private readonly alertService = inject(AlertService);

  loadAlerts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AlertActions.loadAlerts),
      switchMap(() =>
        this.alertService.getAlerts().pipe(
          map((alerts) => AlertActions.loadAlertsSuccess({ alerts })),
          catchError((err) =>
            of(AlertActions.loadAlertsFailure({ error: err?.error?.message ?? 'Failed to load alerts' }))
          )
        )
      )
    )
  );

  createAlert$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AlertActions.createAlert),
      switchMap(({ request }) =>
        this.alertService.createAlert(request).pipe(
          map(() => AlertActions.createAlertSuccess()),
          catchError((err) =>
            of(AlertActions.createAlertFailure({ error: err?.error?.message ?? 'Failed to create alert' }))
          )
        )
      )
    )
  );

  refreshAfterCreate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AlertActions.createAlertSuccess),
      map(() => AlertActions.loadAlerts())
    )
  );

  deleteAlert$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AlertActions.deleteAlert),
      switchMap(({ alertId }) =>
        this.alertService.deleteAlert(alertId).pipe(
          map(() => AlertActions.deleteAlertSuccess({ alertId })),
          catchError((err) =>
            of(AlertActions.deleteAlertFailure({ error: err?.error?.message ?? 'Failed to delete alert' }))
          )
        )
      )
    )
  );
}
