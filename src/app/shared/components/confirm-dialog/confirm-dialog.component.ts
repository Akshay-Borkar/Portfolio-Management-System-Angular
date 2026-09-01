import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

export interface ConfirmDialogData {
  header: string;
  /** May contain simple inline HTML (e.g. <strong>). */
  message: string;
  acceptLabel?: string;
  rejectLabel?: string;
  /** 'danger' colours the accept button as a warning. */
  acceptTone?: 'primary' | 'danger';
  icon?: string;
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, MatDialogModule, MatIconModule],
  template: `
    <h2 mat-dialog-title>
      <mat-icon [class.warn]="data.acceptTone === 'danger'">{{ data.icon || 'help' }}</mat-icon>
      {{ data.header }}
    </h2>
    <mat-dialog-content>
      <p [innerHTML]="data.message"></p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button [mat-dialog-close]="false">{{ data.rejectLabel || 'Cancel' }}</button>
      <button
        mat-flat-button
        [color]="data.acceptTone === 'danger' ? 'warn' : 'primary'"
        [mat-dialog-close]="true"
        cdkFocusInitial
      >
        {{ data.acceptLabel || 'Confirm' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    h2 { display: flex; align-items: center; gap: .5rem; }
    h2 mat-icon.warn { color: var(--mat-sys-error); }
    mat-dialog-content p { margin: 0; line-height: 1.5; }
  `],
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent, boolean>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData,
  ) {}
}
