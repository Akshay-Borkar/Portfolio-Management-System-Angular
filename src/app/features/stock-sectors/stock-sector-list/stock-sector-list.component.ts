import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { AsyncPipe } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageModule } from 'primeng/message';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import {
  loadSectors,
  createSector,
  deleteSector,
} from '../../../store/stock-sector/stock-sector.actions';
import {
  selectAllSectors,
  selectSectorsError,
  selectSectorsLoading,
} from '../../../store/stock-sector/stock-sector.selectors';

@Component({
  selector: 'app-stock-sector-list',
  standalone: true,
  imports: [
    ReactiveFormsModule, RouterLink, AsyncPipe,
    TableModule, ButtonModule, DialogModule, InputTextModule,
    InputNumberModule, ProgressSpinnerModule, MessageModule, ConfirmDialogModule,
  ],
  providers: [ConfirmationService],
  template: `
    <div class="flex justify-content-between align-items-center mb-3">
      <h2 class="m-0">Stock Sectors</h2>
      <p-button label="New Sector" icon="pi pi-plus" (onClick)="showDialog = true" />
    </div>

    @if (loading$ | async) {
      <div class="flex justify-content-center py-5">
        <p-progressSpinner />
      </div>
    }

    @if (error$ | async; as err) {
      <p-message severity="error" [text]="err" styleClass="mb-3" />
    }

    <p-table [value]="(sectors$ | async) ?? []" [paginator]="true" [rows]="10" stripedRows>
      <ng-template pTemplate="header">
        <tr>
          <th>Sector Name</th>
          <th>Sector P/E</th>
          <th style="width:160px">Actions</th>
        </tr>
      </ng-template>
      <ng-template pTemplate="body" let-sector>
        <tr>
          <td>{{ sector.stockSectorName }}</td>
          <td>{{ sector.sectorPE ?? '—' }}</td>
          <td>
            <div class="flex gap-2">
              <p-button
                icon="pi pi-eye"
                severity="info"
                size="small"
                [routerLink]="['/sectors', sector.id]"
                pTooltip="View details"
              />
              <p-button
                icon="pi pi-trash"
                severity="danger"
                size="small"
                (onClick)="onDelete(sector.id, sector.stockSectorName)"
                pTooltip="Delete"
              />
            </div>
          </td>
        </tr>
      </ng-template>
      <ng-template pTemplate="emptymessage">
        <tr><td colspan="3" class="text-center py-4">No sectors found.</td></tr>
      </ng-template>
    </p-table>

    <!-- Create Dialog -->
    <p-dialog
      header="New Stock Sector"
      [(visible)]="showDialog"
      [style]="{ width: '360px' }"
      [modal]="true"
      (onHide)="createForm.reset()"
    >
      <form [formGroup]="createForm" (ngSubmit)="onCreate()">
        <div class="flex flex-column gap-3 pt-2">
          <div class="flex flex-column gap-1">
            <label>Sector Name</label>
            <input pInputText formControlName="stockSectorName" placeholder="e.g. Technology" />
          </div>
          <div class="flex flex-column gap-1">
            <label>Sector P/E (optional)</label>
            <p-inputNumber formControlName="sectorPE" [minFractionDigits]="2" placeholder="e.g. 25.5" />
          </div>
        </div>
        <div class="flex justify-content-end gap-2 mt-4">
          <p-button label="Cancel" severity="secondary" (onClick)="showDialog = false" />
          <p-button label="Create" type="submit" [disabled]="createForm.invalid" />
        </div>
      </form>
    </p-dialog>

    <p-confirmDialog />
  `,
})
export class StockSectorListComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly fb = inject(FormBuilder);
  private readonly confirmationService = inject(ConfirmationService);

  readonly sectors$ = this.store.select(selectAllSectors);
  readonly loading$ = this.store.select(selectSectorsLoading);
  readonly error$ = this.store.select(selectSectorsError);

  showDialog = false;

  createForm = this.fb.nonNullable.group({
    stockSectorName: ['', Validators.required],
    sectorPE: [null as number | null],
  });

  ngOnInit(): void {
    this.store.dispatch(loadSectors());
  }

  onCreate(): void {
    if (this.createForm.invalid) return;
    this.store.dispatch(createSector({ request: this.createForm.getRawValue() }));
    this.showDialog = false;
    this.createForm.reset();
  }

  onDelete(id: string, name: string): void {
    this.confirmationService.confirm({
      message: `Delete sector "${name}"?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.store.dispatch(deleteSector({ id })),
    });
  }
}
