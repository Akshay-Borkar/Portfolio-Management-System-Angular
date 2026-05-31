import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpEventType, HttpRequest } from '@angular/common/http';
import { Observable, map, filter } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiEndpoints } from '../constants/app.constants';

export type UploadProgress =
  | { kind: 'progress'; percent: number }
  | { kind: 'accepted' };

@Injectable({ providedIn: 'root' })
export class DocumentService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}${ApiEndpoints.Documents.Base}`;

  uploadPdf(file: File): Observable<UploadProgress> {
    const formData = new FormData();
    formData.append('file', file, file.name);

    const req = new HttpRequest('POST', `${this.base}${ApiEndpoints.Documents.Ingest}`, formData, {
      reportProgress: true,
    });

    return this.http.request(req).pipe(
      filter(
        (event) =>
          event.type === HttpEventType.UploadProgress ||
          event.type === HttpEventType.Response
      ),
      map((event) => {
        if (event.type === HttpEventType.UploadProgress) {
          const percent = Math.round(
            (100 * event.loaded) / (event.total ?? event.loaded)
          );
          return { kind: 'progress' as const, percent };
        }
        return { kind: 'accepted' as const };
      })
    );
  }

  listDocuments(): Observable<string[]> {
    return this.http.get<string[]>(`${this.base}${ApiEndpoints.Documents.List}`);
  }
}
