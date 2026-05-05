import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import { MessageService } from 'primeng/api';
import {
  addStockSuccess,
  addStockFailure,
  addInvestmentSuccess,
  addInvestmentFailure,
  loadPortfolioFailure,
  deleteStockSuccess,
  deleteStockFailure,
} from '../portfolio/portfolio.actions';
import {
  createSectorSuccess,
  createSectorFailure,
  updateSectorSuccess,
  updateSectorFailure,
  deleteSectorSuccess,
  deleteSectorFailure,
  loadSectorsFailure,
} from '../stock-sector/stock-sector.actions';
import { registerSuccess, registerFailure } from '../auth/auth.actions';
import { createAlertSuccess, createAlertFailure, deleteAlertSuccess, deleteAlertFailure } from '../alert/alert.actions';

@Injectable()
export class NotificationEffects {
  private readonly actions$ = inject(Actions);
  private readonly messageService = inject(MessageService);

  addStockSuccess$ = createEffect(
    () => this.actions$.pipe(
      ofType(addStockSuccess),
      tap(() => this.success('Stock Added', 'Stock added to your portfolio.'))
    ), { dispatch: false }
  );

  addStockFailure$ = createEffect(
    () => this.actions$.pipe(
      ofType(addStockFailure),
      tap(({ error }) => this.error('Failed to Add Stock', error))
    ), { dispatch: false }
  );

  addInvestmentSuccess$ = createEffect(
    () => this.actions$.pipe(
      ofType(addInvestmentSuccess),
      tap(() => this.success('Investment Recorded', 'Your investment has been saved.'))
    ), { dispatch: false }
  );

  addInvestmentFailure$ = createEffect(
    () => this.actions$.pipe(
      ofType(addInvestmentFailure),
      tap(({ error }) => this.error('Failed to Record Investment', error))
    ), { dispatch: false }
  );

  loadPortfolioFailure$ = createEffect(
    () => this.actions$.pipe(
      ofType(loadPortfolioFailure),
      tap(({ error }) => this.error('Portfolio Error', error))
    ), { dispatch: false }
  );

  createSectorSuccess$ = createEffect(
    () => this.actions$.pipe(
      ofType(createSectorSuccess),
      tap(() => this.success('Sector Created', 'New sector has been added.'))
    ), { dispatch: false }
  );

  createSectorFailure$ = createEffect(
    () => this.actions$.pipe(
      ofType(createSectorFailure),
      tap(({ error }) => this.error('Failed to Create Sector', error))
    ), { dispatch: false }
  );

  updateSectorSuccess$ = createEffect(
    () => this.actions$.pipe(
      ofType(updateSectorSuccess),
      tap(() => this.success('Sector Updated', 'Changes have been saved.'))
    ), { dispatch: false }
  );

  updateSectorFailure$ = createEffect(
    () => this.actions$.pipe(
      ofType(updateSectorFailure),
      tap(({ error }) => this.error('Failed to Update Sector', error))
    ), { dispatch: false }
  );

  deleteSectorSuccess$ = createEffect(
    () => this.actions$.pipe(
      ofType(deleteSectorSuccess),
      tap(() => this.success('Sector Deleted', 'The sector has been removed.'))
    ), { dispatch: false }
  );

  deleteSectorFailure$ = createEffect(
    () => this.actions$.pipe(
      ofType(deleteSectorFailure),
      tap(({ error }) => this.error('Failed to Delete Sector', error))
    ), { dispatch: false }
  );

  loadSectorsFailure$ = createEffect(
    () => this.actions$.pipe(
      ofType(loadSectorsFailure),
      tap(({ error }) => this.error('Failed to Load Sectors', error))
    ), { dispatch: false }
  );

  registerSuccess$ = createEffect(
    () => this.actions$.pipe(
      ofType(registerSuccess),
      tap(() => this.success('Account Created', 'You can now log in.'))
    ), { dispatch: false }
  );

  registerFailure$ = createEffect(
    () => this.actions$.pipe(
      ofType(registerFailure),
      tap(({ error }) => this.error('Registration Failed', error))
    ), { dispatch: false }
  );

  deleteStockSuccess$ = createEffect(
    () => this.actions$.pipe(
      ofType(deleteStockSuccess),
      tap(() => this.success('Stock Removed', 'The stock and all its investments have been deleted.'))
    ), { dispatch: false }
  );

  deleteStockFailure$ = createEffect(
    () => this.actions$.pipe(
      ofType(deleteStockFailure),
      tap(({ error }) => this.error('Failed to Delete Stock', error))
    ), { dispatch: false }
  );

  createAlertSuccess$ = createEffect(
    () => this.actions$.pipe(
      ofType(createAlertSuccess),
      tap(() => this.success('Alert Created', 'You will be notified when the price is reached.'))
    ), { dispatch: false }
  );

  createAlertFailure$ = createEffect(
    () => this.actions$.pipe(
      ofType(createAlertFailure),
      tap(({ error }) => this.error('Failed to Create Alert', error))
    ), { dispatch: false }
  );

  deleteAlertSuccess$ = createEffect(
    () => this.actions$.pipe(
      ofType(deleteAlertSuccess),
      tap(() => this.success('Alert Deleted', 'The price alert has been removed.'))
    ), { dispatch: false }
  );

  deleteAlertFailure$ = createEffect(
    () => this.actions$.pipe(
      ofType(deleteAlertFailure),
      tap(({ error }) => this.error('Failed to Delete Alert', error))
    ), { dispatch: false }
  );

  private success(summary: string, detail: string): void {
    this.messageService.add({ severity: 'success', summary, detail, life: 4000 });
  }

  private error(summary: string, detail: string): void {
    this.messageService.add({ severity: 'error', summary, detail, life: 5000 });
  }
}
