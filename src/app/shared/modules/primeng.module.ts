import { NgModule } from '@angular/core';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MenubarModule } from 'primeng/menubar';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

const MODULES = [
  BadgeModule,
  ButtonModule,
  CalendarModule,
  CardModule,
  ChartModule,
  ConfirmDialogModule,
  DialogModule,
  DropdownModule,
  InputNumberModule,
  InputTextModule,
  MenubarModule,
  MessageModule,
  PasswordModule,
  ProgressSpinnerModule,
  TableModule,
  TagModule,
];

@NgModule({
  imports: MODULES,
  exports: MODULES,
})
export class PrimengModule {}
