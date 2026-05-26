import {
  Component,
  ElementRef,
  ViewChild,
  inject,
  output,
  signal,
} from '@angular/core';
import { SharedModule } from '../../../shared/modules/shared.module';
import { DocumentService } from '../../../core/services/document.service';

type UploadState = 'idle' | 'uploading' | 'processing' | 'done' | 'error';

const MAX_FILE_SIZE = 20 * 1024 * 1024;

@Component({
  selector: 'app-document-upload',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './document-upload.component.html',
  styleUrl: './document-upload.component.css',
})
export class DocumentUploadComponent {
  private readonly documentService = inject(DocumentService);

  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;

  readonly uploaded = output<void>();

  state = signal<UploadState>('idle');
  uploadPercent = signal(0);
  errorMessage = signal('');
  selectedFile = signal<File | null>(null);

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';

    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      this.setError('Only PDF files are accepted.');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      this.setError('File exceeds the 20 MB limit.');
      return;
    }

    this.selectedFile.set(file);
    this.startUpload(file);
  }

  triggerFilePicker(): void {
    this.fileInputRef.nativeElement.click();
  }

  reset(): void {
    this.state.set('idle');
    this.uploadPercent.set(0);
    this.errorMessage.set('');
    this.selectedFile.set(null);
  }

  private startUpload(file: File): void {
    this.state.set('uploading');
    this.uploadPercent.set(0);

    this.documentService.uploadPdf(file).subscribe({
      next: (event) => {
        if (event.kind === 'progress') {
          this.uploadPercent.set(event.percent);
        } else {
          this.state.set('processing');
          setTimeout(() => {
            this.state.set('done');
            this.uploaded.emit();
          }, 1500);
        }
      },
      error: (err) => {
        const msg =
          err?.error?.message ??
          (err?.status === 503
            ? 'Document service is not configured on the server.'
            : 'Upload failed. Please try again.');
        this.setError(msg);
      },
    });
  }

  private setError(msg: string): void {
    this.errorMessage.set(msg);
    this.state.set('error');
  }
}
