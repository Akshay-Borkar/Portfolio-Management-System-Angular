import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SharedModule } from '../../shared/modules/shared.module';
import { PortfolioReview } from '../../core/models/portfolio-review.models';

@Component({
  selector: 'app-portfolio-review-modal',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './portfolio-review-modal.component.html',
  styleUrl: './portfolio-review-modal.component.css',
})
export class PortfolioReviewModalComponent {
  constructor(
    public dialogRef: MatDialogRef<PortfolioReviewModalComponent>,
    @Inject(MAT_DIALOG_DATA) public review: PortfolioReview | null,
  ) {}

  close(): void {
    this.dialogRef.close();
  }
}
