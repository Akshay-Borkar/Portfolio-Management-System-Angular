import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { CreateAlertRequest } from '../../core/models/alert.models';

@Component({
  selector: 'app-alert-create-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
  ],
  template: `
    <h2 mat-dialog-title>New Price Alert</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="flex flex-column gap-2 pt-2">
        <mat-form-field appearance="outline">
          <mat-label>Ticker Symbol</mat-label>
          <input matInput formControlName="ticker" placeholder="e.g. AAPL" class="ticker-input" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Condition</mat-label>
          <mat-select formControlName="condition">
            <mat-option value="Above">Above</mat-option>
            <mat-option value="Below">Below</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Target Price (USD)</mat-label>
          <span matTextPrefix>$&nbsp;</span>
          <input matInput type="number" formControlName="targetPrice" min="0" step="0.01" />
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button [mat-dialog-close]="null">Cancel</button>
      <button mat-flat-button color="primary" [disabled]="form.invalid" (click)="submit()">
        <mat-icon>notifications_active</mat-icon>
        Create Alert
      </button>
    </mat-dialog-actions>
  `,
  styles: [
    'mat-form-field { width: 100%; }',
    '.ticker-input { text-transform: uppercase; }',
  ],
})
export class AlertCreateDialogComponent {
  private readonly fb = inject(FormBuilder);
  readonly dialogRef = inject(MatDialogRef<AlertCreateDialogComponent, CreateAlertRequest>);

  readonly form = this.fb.nonNullable.group({
    ticker: ['', Validators.required],
    condition: ['Above', Validators.required],
    targetPrice: [null as number | null, [Validators.required, Validators.min(0.01)]],
  });

  submit(): void {
    if (this.form.invalid) return;
    const v = this.form.getRawValue();
    this.dialogRef.close({
      ticker: v.ticker.toUpperCase(),
      condition: v.condition,
      targetPrice: v.targetPrice!,
    });
  }
}
