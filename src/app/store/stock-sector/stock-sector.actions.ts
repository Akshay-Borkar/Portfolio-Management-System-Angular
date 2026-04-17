import { createAction, props } from '@ngrx/store';
import {
  CreateSectorRequest,
  StockSectorDetailDTO,
  StockSectorDTO,
  UpdateSectorRequest,
} from '../../core/models/stock-sector.models';

export const loadSectors = createAction('[StockSector] Load Sectors');
export const loadSectorsSuccess = createAction(
  '[StockSector] Load Sectors Success',
  props<{ sectors: StockSectorDTO[] }>()
);
export const loadSectorsFailure = createAction(
  '[StockSector] Load Sectors Failure',
  props<{ error: string }>()
);

export const loadSectorDetail = createAction(
  '[StockSector] Load Sector Detail',
  props<{ id: string }>()
);
export const loadSectorDetailSuccess = createAction(
  '[StockSector] Load Sector Detail Success',
  props<{ sector: StockSectorDetailDTO }>()
);
export const loadSectorDetailFailure = createAction(
  '[StockSector] Load Sector Detail Failure',
  props<{ error: string }>()
);

export const createSector = createAction(
  '[StockSector] Create Sector',
  props<{ request: CreateSectorRequest }>()
);
export const createSectorSuccess = createAction('[StockSector] Create Sector Success');
export const createSectorFailure = createAction(
  '[StockSector] Create Sector Failure',
  props<{ error: string }>()
);

export const updateSector = createAction(
  '[StockSector] Update Sector',
  props<{ request: UpdateSectorRequest }>()
);
export const updateSectorSuccess = createAction('[StockSector] Update Sector Success');
export const updateSectorFailure = createAction(
  '[StockSector] Update Sector Failure',
  props<{ error: string }>()
);

export const deleteSector = createAction(
  '[StockSector] Delete Sector',
  props<{ id: string }>()
);
export const deleteSectorSuccess = createAction(
  '[StockSector] Delete Sector Success',
  props<{ id: string }>()
);
export const deleteSectorFailure = createAction(
  '[StockSector] Delete Sector Failure',
  props<{ error: string }>()
);
