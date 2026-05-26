import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PrimengModule } from './primeng.module';
import { MarkdownPipe } from '../pipes/markdown.pipe';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, PrimengModule, MarkdownPipe],
  exports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, PrimengModule, MarkdownPipe],
})
export class SharedModule {}
