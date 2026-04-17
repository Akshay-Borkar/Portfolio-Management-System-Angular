import { createFeatureSelector, createSelector } from '@ngrx/store';
import { adapter, StockSectorState } from './stock-sector.reducer';

export const selectSectorState =
  createFeatureSelector<StockSectorState>('stockSector');

const { selectAll } = adapter.getSelectors();

export const selectAllSectors = createSelector(selectSectorState, selectAll);
export const selectSectorsLoading = createSelector(
  selectSectorState,
  (s) => s.loading
);
export const selectSectorsError = createSelector(
  selectSectorState,
  (s) => s.error
);
export const selectSelectedSector = createSelector(
  selectSectorState,
  (s) => s.selectedSector
);
