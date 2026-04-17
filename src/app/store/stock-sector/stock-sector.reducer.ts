import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { StockSectorDetailDTO, StockSectorDTO } from '../../core/models/stock-sector.models';
import * as SectorActions from './stock-sector.actions';

export interface StockSectorState extends EntityState<StockSectorDTO> {
  selectedSector: StockSectorDetailDTO | null;
  loading: boolean;
  error: string | null;
}

export const adapter = createEntityAdapter<StockSectorDTO>({
  selectId: (s) => s.id,
});

export const initialState: StockSectorState = adapter.getInitialState({
  selectedSector: null,
  loading: false,
  error: null,
});

export const stockSectorReducer = createReducer(
  initialState,

  on(SectorActions.loadSectors, SectorActions.loadSectorDetail,
     SectorActions.createSector, SectorActions.updateSector, SectorActions.deleteSector,
    (state) => ({ ...state, loading: true, error: null })
  ),

  on(SectorActions.loadSectorsSuccess, (state, { sectors }) =>
    adapter.setAll(sectors, { ...state, loading: false })
  ),

  on(SectorActions.loadSectorDetailSuccess, (state, { sector }) => ({
    ...state,
    selectedSector: sector,
    loading: false,
  })),

  on(SectorActions.deleteSectorSuccess, (state, { id }) =>
    adapter.removeOne(id, { ...state, loading: false })
  ),

  on(
    SectorActions.createSectorSuccess,
    SectorActions.updateSectorSuccess,
    (state) => ({ ...state, loading: false })
  ),

  on(
    SectorActions.loadSectorsFailure,
    SectorActions.loadSectorDetailFailure,
    SectorActions.createSectorFailure,
    SectorActions.updateSectorFailure,
    SectorActions.deleteSectorFailure,
    (state, { error }) => ({ ...state, loading: false, error })
  )
);
