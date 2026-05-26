import { Component, OnInit, inject, signal } from '@angular/core';
import { SharedModule } from '../../../shared/modules/shared.module';
import { DocumentService } from '../../../core/services/document.service';

@Component({
  selector: 'app-document-list',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './document-list.component.html',
  styleUrl: './document-list.component.css',
})
export class DocumentListComponent implements OnInit {
  private readonly documentService = inject(DocumentService);

  documents = signal<string[]>([]);
  loading = signal(false);
  error = signal(false);

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(false);

    this.documentService.listDocuments().subscribe({
      next: (docs) => {
        this.documents.set(docs);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      },
    });
  }
}
