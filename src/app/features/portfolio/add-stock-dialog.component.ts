import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AddStockRequest } from '../../core/models/portfolio.models';

export interface AddStockDialogData {
  sectors$: Observable<{ id: string; stockSectorName: string }[]>;
  loading$: Observable<boolean>;
}

@Component({
  selector: 'app-add-stock-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    AsyncPipe,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  template: `
    <h2 mat-dialog-title>Add Stock to Portfolio</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="flex flex-column gap-2 pt-2">
        <mat-form-field appearance="outline">
          <mat-label>Ticker Symbol</mat-label>
          <input matInput formControlName="ticker" placeholder="e.g. RELIANCE.NS" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Stock Name</mat-label>
          <input matInput formControlName="stockName" placeholder="e.g. Reliance Industries" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Sector</mat-label>
          <mat-select formControlName="stockSectorId">
            @for (s of (data.sectors$ | async) ?? []; track s.id) {
              <mat-option [value]="s.id">{{ s.stockSectorName }}</mat-option>
            }
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Stock P/E (optional)</mat-label>
          <input matInput type="number" formControlName="stockPE" placeholder="e.g. 25.50" />
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button [mat-dialog-close]="null">Cancel</button>
      <button
        mat-flat-button
        color="primary"
        [disabled]="form.invalid || !!(data.loading$ | async)"
        (click)="submit()"
      >
        Add Stock
      </button>
    </mat-dialog-actions>
  `,
  styles: ['mat-form-field { width: 100%; }'],
})
export class AddStockDialogComponent {
  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.group({
    ticker: ['', [Validators.required, Validators.maxLength(20)]],
    stockName: ['', [Validators.required, Validators.maxLength(100)]],
    stockSectorId: ['', Validators.required],
    stockPE: [null as number | null],
  });

  constructor(
    private readonly dialogRef: MatDialogRef<AddStockDialogComponent, AddStockRequest>,
    @Inject(MAT_DIALOG_DATA) public data: AddStockDialogData,
  ) {}

  submit(): void {
    if (this.form.invalid) return;
    const v = this.form.value;
    this.dialogRef.close({
      ticker: v.ticker!,
      stockName: v.stockName!,
      stockSectorId: v.stockSectorId!,
      stockPE: v.stockPE ?? null,
    });
  }
}
