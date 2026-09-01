import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { AddInvestmentRequest, PortfolioHoldingDTO } from '../../core/models/portfolio.models';

export interface AddInvestmentDialogData {
  holdings$: Observable<PortfolioHoldingDTO[]>;
  loading$: Observable<boolean>;
}

@Component({
  selector: 'app-add-investment-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    AsyncPipe,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
  ],
  template: `
    <h2 mat-dialog-title>Record Investment</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="flex flex-column gap-2 pt-2">
        <mat-form-field appearance="outline">
          <mat-label>Stock</mat-label>
          <mat-select formControlName="stockId">
            @for (h of (data.holdings$ | async) ?? []; track h.stockId) {
              <mat-option [value]="h.stockId">{{ h.ticker }}</mat-option>
            }
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Amount Invested (₹)</mat-label>
          <input matInput type="number" formControlName="investedAmount" placeholder="e.g. 50000" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Buying Price per Share (₹)</mat-label>
          <input matInput type="number" formControlName="buyingPrice" placeholder="e.g. 2500.00" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Investment Date</mat-label>
          <input matInput [matDatepicker]="picker" [max]="today" formControlName="investmentDate" />
          <mat-datepicker-toggle matIconSuffix [for]="picker" />
          <mat-datepicker #picker />
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
        Record
      </button>
    </mat-dialog-actions>
  `,
  styles: ['mat-form-field { width: 100%; }'],
})
export class AddInvestmentDialogComponent {
  private readonly fb = inject(FormBuilder);
  readonly today = new Date();

  readonly form = this.fb.group({
    stockId: ['', Validators.required],
    investedAmount: [null as number | null, [Validators.required, Validators.min(1)]],
    buyingPrice: [null as number | null, [Validators.required, Validators.min(0.01)]],
    investmentDate: [null as Date | null, Validators.required],
  });

  constructor(
    private readonly dialogRef: MatDialogRef<AddInvestmentDialogComponent, AddInvestmentRequest>,
    @Inject(MAT_DIALOG_DATA) public data: AddInvestmentDialogData,
  ) {}

  submit(): void {
    if (this.form.invalid) return;
    const v = this.form.value;
    this.dialogRef.close({
      stockId: v.stockId!,
      investedAmount: v.investedAmount!,
      buyingPrice: v.buyingPrice!,
      investmentDate: (v.investmentDate as Date).toISOString(),
    });
  }
}
