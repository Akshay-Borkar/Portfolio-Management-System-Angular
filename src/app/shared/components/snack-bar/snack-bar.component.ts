import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBarRef,
} from '@angular/material/snack-bar';

export interface SnackBarData {
  severity: 'success' | 'error' | 'info' | 'warn';
  summary: string;
  detail?: string;
}

/** Two-line snackbar body — replacement for <p-toast> messages. */
@Component({
  selector: 'app-snack-bar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, MatIconModule],
  template: `
    <div class="snack" [class]="'snack--' + data.severity">
      <mat-icon>{{ icon }}</mat-icon>
      <div class="snack__body">
        <div class="snack__summary">{{ data.summary }}</div>
        @if (data.detail) { <div class="snack__detail">{{ data.detail }}</div> }
      </div>
      <button mat-icon-button (click)="ref.dismiss()" aria-label="Dismiss">
        <mat-icon>close</mat-icon>
      </button>
    </div>
  `,
  styles: [`
    .snack {
      display: flex;
      align-items: flex-start;
      gap: .625rem;
      min-width: 260px;
    }
    .snack > mat-icon:first-child {
      flex-shrink: 0;
      margin-top: 2px;
    }
    .snack__body { flex: 1; }
    .snack__summary { font-weight: 700; }
    .snack__detail { font-size: .85rem; opacity: .85; margin-top: 2px; }
    .snack--success > mat-icon:first-child { color: #4ade80; }
    .snack--error > mat-icon:first-child { color: #f87171; }
    .snack--warn > mat-icon:first-child { color: #fbbf24; }
    .snack--info > mat-icon:first-child { color: #60a5fa; }
    button { flex-shrink: 0; }
  `],
})
export class SnackBarComponent {
  constructor(
    public ref: MatSnackBarRef<SnackBarComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: SnackBarData,
  ) {}

  get icon(): string {
    switch (this.data.severity) {
      case 'success': return 'check_circle';
      case 'error': return 'error';
      case 'warn': return 'warning';
      default: return 'info';
    }
  }
}
