import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, of, switchMap, withLatestFrom } from 'rxjs';
import { AlertService } from '../../core/services/alert.service';
import * as AlertActions from './alert.actions';
import { selectAlertPage, selectAlertPageSize } from './alert.selectors';

@Injectable()
export class AlertEffects {
  private readonly actions$ = inject(Actions);
  private readonly alertService = inject(AlertService);
  private readonly store = inject(Store);

  loadAlerts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AlertActions.loadAlerts),
      withLatestFrom(this.store.select(selectAlertPage), this.store.select(selectAlertPageSize)),
      switchMap(([action, currentPage, currentPageSize]) => {
        const page = action.page ?? currentPage;
        const pageSize = action.pageSize ?? currentPageSize;
        return this.alertService.getAlerts(page, pageSize).pipe(
          map((result) =>
            AlertActions.loadAlertsSuccess({
              alerts: result.items,
              totalCount: result.totalCount,
              page: result.page,
              pageSize: result.pageSize,
            })
          ),
          catchError((err) =>
            of(AlertActions.loadAlertsFailure({ error: err?.error?.message ?? 'Failed to load alerts' }))
          )
        );
      })
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
      map(() => AlertActions.loadAlerts({}))
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
