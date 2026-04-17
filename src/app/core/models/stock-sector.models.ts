export interface StockSectorDTO {
  id: string;
  stockSectorName: string;
  sectorPE: number | null;
}

export interface StockSectorDetailDTO {
  id: string;
  stockSectorName: string;
  sectorPE: number | null;
  dateCreated: string;
  dateModified: string;
}

export interface CreateSectorRequest {
  stockSectorName: string;
  sectorPE: number | null;
}

export interface UpdateSectorRequest {
  id: string;
  stockSectorName: string;
  sectorPE: number | null;
}
