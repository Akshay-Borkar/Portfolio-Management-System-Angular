import { NgModule } from '@angular/core';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MenubarModule } from 'primeng/menubar';
import { MessageModule } from 'primeng/message';
import { PaginatorModule } from 'primeng/paginator';
import { PasswordModule } from 'primeng/password';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

const MODULES = [
  BadgeModule,
  ButtonModule,
  CalendarModule,
  CardModule,
  ChartModule,
  ConfirmDialogModule,
  DialogModule,
  DropdownModule,
  SelectModule,
  InputNumberModule,
  InputTextModule,
  MenubarModule,
  MessageModule,
  PaginatorModule,
  PasswordModule,
  ProgressSpinnerModule,
  SkeletonModule,
  TableModule,
  TagModule,
  ToastModule,
  TooltipModule,
];

@NgModule({
  imports: MODULES,
  exports: MODULES,
})
export class PrimengModule {}
