import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import { SharedModule } from '../../../shared/modules/shared.module';
import { ConfirmService } from '../../../shared/services/confirm.service';
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
import {
  SectorCreateDialogComponent,
  SectorCreateResult,
} from './sector-create-dialog.component';

@Component({
  selector: 'app-stock-sector-list',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './stock-sector-list.component.html',
  styleUrl: './stock-sector-list.component.css',
})
export class StockSectorListComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly confirm = inject(ConfirmService);
  private readonly dialog = inject(MatDialog);

  readonly sectors$ = this.store.select(selectAllSectors);
  readonly loading$ = this.store.select(selectSectorsLoading);
  readonly error$ = this.store.select(selectSectorsError);

  readonly displayedColumns = ['name', 'pe', 'actions'];

  ngOnInit(): void {
    this.store.dispatch(loadSectors());
  }

  openCreateDialog(): void {
    this.dialog
      .open<SectorCreateDialogComponent, unknown, SectorCreateResult>(SectorCreateDialogComponent, {
        width: '24rem',
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) this.store.dispatch(createSector({ request: result }));
      });
  }

  async onDelete(id: string, name: string): Promise<void> {
    const ok = await this.confirm.confirm({
      header: 'Confirm Delete',
      message: `Delete sector "${name}"?`,
      icon: 'warning',
      acceptTone: 'danger',
      acceptLabel: 'Delete',
    });
    if (ok) this.store.dispatch(deleteSector({ id }));
  }
}
