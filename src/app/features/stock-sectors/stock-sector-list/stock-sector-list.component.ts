import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ConfirmationService } from 'primeng/api';
import { SharedModule } from '../../../shared/modules/shared.module';
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
  imports: [SharedModule],
  providers: [ConfirmationService],
  templateUrl: './stock-sector-list.component.html',
  styleUrl: './stock-sector-list.component.css',
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
