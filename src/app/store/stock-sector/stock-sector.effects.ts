import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { StockSectorService } from '../../core/services/stock-sector.service';
import * as SectorActions from './stock-sector.actions';

@Injectable()
export class StockSectorEffects {
  private readonly actions$ = inject(Actions);
  private readonly sectorService = inject(StockSectorService);

  loadSectors$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SectorActions.loadSectors),
      switchMap(() =>
        this.sectorService.getAll().pipe(
          map((sectors) => SectorActions.loadSectorsSuccess({ sectors })),
          catchError((err) =>
            of(SectorActions.loadSectorsFailure({ error: err?.error?.message ?? 'Failed to load sectors' }))
          )
        )
      )
    )
  );

  loadSectorDetail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SectorActions.loadSectorDetail),
      switchMap(({ id }) =>
        this.sectorService.getById(id).pipe(
          map((sector) => SectorActions.loadSectorDetailSuccess({ sector })),
          catchError((err) =>
            of(SectorActions.loadSectorDetailFailure({ error: err?.error?.message ?? 'Failed to load sector' }))
          )
        )
      )
    )
  );

  createSector$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SectorActions.createSector),
      switchMap(({ request }) =>
        this.sectorService.create(request).pipe(
          map(() => SectorActions.createSectorSuccess()),
          catchError((err) =>
            of(SectorActions.createSectorFailure({ error: err?.error?.message ?? 'Create failed' }))
          )
        )
      )
    )
  );

  updateSector$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SectorActions.updateSector),
      switchMap(({ request }) =>
        this.sectorService.update(request).pipe(
          map(() => SectorActions.updateSectorSuccess()),
          catchError((err) =>
            of(SectorActions.updateSectorFailure({ error: err?.error?.message ?? 'Update failed' }))
          )
        )
      )
    )
  );

  deleteSector$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SectorActions.deleteSector),
      switchMap(({ id }) =>
        this.sectorService.delete(id).pipe(
          map(() => SectorActions.deleteSectorSuccess({ id })),
          catchError((err) =>
            of(SectorActions.deleteSectorFailure({ error: err?.error?.message ?? 'Delete failed' }))
          )
        )
      )
    )
  );

  // Refresh list after create/update/delete
  refreshAfterMutation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        SectorActions.createSectorSuccess,
        SectorActions.updateSectorSuccess,
        SectorActions.deleteSectorSuccess
      ),
      map(() => SectorActions.loadSectors())
    )
  );
}
