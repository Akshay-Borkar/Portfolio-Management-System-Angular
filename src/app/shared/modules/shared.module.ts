import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PrimengModule } from './primeng.module';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, PrimengModule],
  exports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, PrimengModule],
})
export class SharedModule {}
