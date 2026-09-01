import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
} from '../components/confirm-dialog/confirm-dialog.component';

/**
 * Replacement for PrimeNG's ConfirmationService. Opens a MatDialog and resolves
 * to true when the user accepts, false otherwise.
 *
 *   if (await this.confirm.confirm({ header: 'Delete', message: '…', acceptTone: 'danger' })) { … }
 */
@Injectable({ providedIn: 'root' })
export class ConfirmService {
  private readonly dialog = inject(MatDialog);

  async confirm(data: ConfirmDialogData): Promise<boolean> {
    const ref = this.dialog.open<ConfirmDialogComponent, ConfirmDialogData, boolean>(
      ConfirmDialogComponent,
      { data, width: '25rem', autoFocus: false },
    );
    return (await firstValueFrom(ref.afterClosed())) ?? false;
  }
}
