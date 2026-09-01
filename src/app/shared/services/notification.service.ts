import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarComponent, SnackBarData } from '../components/snack-bar/snack-bar.component';

/**
 * Replacement for PrimeNG's MessageService. Shows a two-line snackbar
 * (summary + detail) bottom-right, colour-coded by severity.
 */
@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly snackBar = inject(MatSnackBar);

  success(summary: string, detail?: string): void {
    this.show({ severity: 'success', summary, detail }, 4000);
  }

  error(summary: string, detail?: string): void {
    this.show({ severity: 'error', summary, detail }, 6000);
  }

  info(summary: string, detail?: string): void {
    this.show({ severity: 'info', summary, detail }, 5000);
  }

  warn(summary: string, detail?: string): void {
    this.show({ severity: 'warn', summary, detail }, 5000);
  }

  private show(data: SnackBarData, duration: number): void {
    this.snackBar.openFromComponent(SnackBarComponent, {
      data,
      duration,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      panelClass: `snack-panel--${data.severity}`,
    });
  }
}
