import { Component, Input, Output, EventEmitter } from '@angular/core';
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
  @Input() visible = false;
  @Input() review: PortfolioReview | null = null;
  @Output() visibleChange = new EventEmitter<boolean>();

  close(): void {
    this.visibleChange.emit(false);
  }
}
