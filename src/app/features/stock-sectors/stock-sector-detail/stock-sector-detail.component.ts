import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AsyncPipe, DatePipe } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageModule } from 'primeng/message';
import { loadSectorDetail, updateSector } from '../../../store/stock-sector/stock-sector.actions';
import {
  selectSelectedSector,
  selectSectorsError,
  selectSectorsLoading,
} from '../../../store/stock-sector/stock-sector.selectors';
import { filter, take } from 'rxjs';

@Component({
  selector: 'app-stock-sector-detail',
  standalone: true,
  imports: [
    ReactiveFormsModule, RouterLink, AsyncPipe, DatePipe,
    CardModule, ButtonModule, InputTextModule, InputNumberModule,
    ProgressSpinnerModule, MessageModule,
  ],
  template: `
    <div class="mb-3">
      <p-button label="← Back to Sectors" routerLink="/sectors" severity="secondary" size="small" />
    </div>

    @if (loading$ | async) {
      <div class="flex justify-content-center py-5"><p-progressSpinner /></div>
    }

    @if (error$ | async; as err) {
      <p-message severity="error" [text]="err" styleClass="mb-3" />
    }

    @if (sector$ | async; as sector) {
      <p-card [header]="sector.stockSectorName">
        <ng-template pTemplate="subtitle">
          <span class="text-sm text-color-secondary">
            Created: {{ sector.dateCreated | date:'medium' }} &nbsp;|&nbsp;
            Modified: {{ sector.dateModified | date:'medium' }}
          </span>
        </ng-template>

        <form [formGroup]="form" (ngSubmit)="onSave()">
          <div class="flex flex-column gap-3 mt-2" style="max-width: 360px">
            <div class="flex flex-column gap-1">
              <label>Sector Name</label>
              <input pInputText formControlName="stockSectorName" />
            </div>
            <div class="flex flex-column gap-1">
              <label>Sector P/E</label>
              <p-inputNumber formControlName="sectorPE" [minFractionDigits]="2" />
            </div>
            <div class="flex gap-2">
              <p-button label="Save Changes" type="submit" [disabled]="form.invalid || form.pristine" />
            </div>
          </div>
        </form>
      </p-card>
    }
  `,
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
