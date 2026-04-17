import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  CreateSectorRequest,
  StockSectorDTO,
  StockSectorDetailDTO,
  UpdateSectorRequest,
} from '../models/stock-sector.models';

@Injectable({ providedIn: 'root' })
export class StockSectorService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/api/stocksector`;

  getAll(): Observable<StockSectorDTO[]> {
    return this.http.get<StockSectorDTO[]>(this.base);
  }

  getById(id: string): Observable<StockSectorDetailDTO> {
    return this.http.get<StockSectorDetailDTO>(`${this.base}/${id}`);
  }

  create(body: CreateSectorRequest): Observable<void> {
    return this.http.post<void>(this.base, body);
  }

  update(body: UpdateSectorRequest): Observable<void> {
    return this.http.put<void>(`${this.base}/${body.id}`, body);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
