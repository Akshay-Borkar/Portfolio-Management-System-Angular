import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from './material.module';
import { MarkdownPipe } from '../pipes/markdown.pipe';
import { SkeletonComponent } from '../components/skeleton/skeleton.component';
import { InlineMessageComponent } from '../components/inline-message/inline-message.component';
import { TagComponent } from '../components/tag/tag.component';

const SHARED = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  RouterModule,
  MaterialModule,
  MarkdownPipe,
  SkeletonComponent,
  InlineMessageComponent,
  TagComponent,
];

@NgModule({
  imports: SHARED,
  exports: SHARED,
})
export class SharedModule {}
