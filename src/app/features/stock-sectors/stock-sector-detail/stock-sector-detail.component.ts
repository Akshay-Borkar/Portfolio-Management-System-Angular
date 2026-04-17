import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { filter, take } from 'rxjs';
import { SharedModule } from '../../../shared/modules/shared.module';
import { loadSectorDetail, updateSector } from '../../../store/stock-sector/stock-sector.actions';
import {
  selectSelectedSector,
  selectSectorsError,
  selectSectorsLoading,
} from '../../../store/stock-sector/stock-sector.selectors';

@Component({
  selector: 'app-stock-sector-detail',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './stock-sector-detail.component.html',
  styleUrl: './stock-sector-detail.component.css',
})
export class StockSectorDetailComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);

  readonly sector$ = this.store.select(selectSelectedSector);
  readonly loading$ = this.store.select(selectSectorsLoading);
  readonly error$ = this.store.select(selectSectorsError);

  form = this.fb.nonNullable.group({
    stockSectorName: ['', Validators.required],
    sectorPE: [null as number | null],
  });

  private sectorId = '';

  ngOnInit(): void {
    this.sectorId = this.route.snapshot.paramMap.get('id') ?? '';
    this.store.dispatch(loadSectorDetail({ id: this.sectorId }));

    this.sector$.pipe(filter(Boolean), take(1)).subscribe((s) => {
      this.form.patchValue({ stockSectorName: s.stockSectorName, sectorPE: s.sectorPE });
    });
  }

  onSave(): void {
    if (this.form.invalid) return;
    this.store.dispatch(
      updateSector({
        request: { id: this.sectorId, ...this.form.getRawValue() },
      })
    );
    this.form.markAsPristine();
  }
}
