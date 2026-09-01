import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

export interface SectorCreateResult {
  stockSectorName: string;
  sectorPE: number | null;
}

@Component({
  selector: 'app-sector-create-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, MatButtonModule, MatDialogModule, MatFormFieldModule, MatInputModule],
  template: `
    <h2 mat-dialog-title>New Stock Sector</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="flex flex-column gap-2 pt-2">
        <mat-form-field appearance="outline">
          <mat-label>Sector Name</mat-label>
          <input matInput formControlName="stockSectorName" placeholder="e.g. Technology" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Sector P/E (optional)</mat-label>
          <input matInput type="number" formControlName="sectorPE" placeholder="e.g. 25.5" />
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button [mat-dialog-close]="null">Cancel</button>
      <button mat-flat-button color="primary" [disabled]="form.invalid" (click)="submit()">Create</button>
    </mat-dialog-actions>
  `,
  styles: ['mat-form-field { width: 100%; }'],
})
export class SectorCreateDialogComponent {
  private readonly fb = inject(FormBuilder);
  readonly dialogRef = inject(MatDialogRef<SectorCreateDialogComponent, SectorCreateResult>);

  readonly form = this.fb.nonNullable.group({
    stockSectorName: ['', Validators.required],
    sectorPE: [null as number | null],
  });

  submit(): void {
    if (this.form.invalid) return;
    this.dialogRef.close(this.form.getRawValue());
  }
}
