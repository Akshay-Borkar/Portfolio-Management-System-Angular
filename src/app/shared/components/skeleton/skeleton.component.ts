import { booleanAttribute, ChangeDetectionStrategy, Component, Input } from '@angular/core';

/**
 * Lightweight replacement for <p-skeleton>. Renders a shimmering placeholder box.
 * Usage: <app-skeleton height="2rem" width="8rem" />  |  <app-skeleton circle size="200px" />
 */
@Component({
  selector: 'app-skeleton',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '',
  host: {
    '[style.height]': 'circle ? size : height',
    '[style.width]': 'circle ? size : width',
    '[class.app-skeleton--circle]': 'circle',
    class: 'app-skeleton',
  },
  styles: [`
    .app-skeleton {
      display: block;
      position: relative;
      overflow: hidden;
      border-radius: 8px;
      background: color-mix(in srgb, var(--mat-sys-on-surface) 8%, transparent);
    }
    .app-skeleton--circle { border-radius: 50%; }
    .app-skeleton::after {
      content: '';
      position: absolute;
      inset: 0;
      transform: translateX(-100%);
      background: linear-gradient(
        90deg,
        transparent,
        color-mix(in srgb, var(--mat-sys-on-surface) 6%, transparent),
        transparent
      );
      animation: app-skeleton-shimmer 1.4s ease-in-out infinite;
    }
    @keyframes app-skeleton-shimmer { 100% { transform: translateX(100%); } }
    @media (prefers-reduced-motion: reduce) {
      .app-skeleton::after { animation-duration: 4s; }
    }
  `],
})
export class SkeletonComponent {
  @Input() height = '1rem';
  @Input() width = '100%';
  @Input({ transform: booleanAttribute }) circle = false;
  @Input() size = '2rem';
}
