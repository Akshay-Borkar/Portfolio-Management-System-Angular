import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

type Severity = 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | undefined;

/** Replacement for <p-tag> — a small coloured pill, optionally with a leading icon. */
@Component({
  selector: 'app-tag',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule],
  template: `
    <span class="tag" [class]="severityClass + ' ' + styleClass" [class.tag--has-icon]="!!icon">
      @if (icon) { <mat-icon>{{ icon }}</mat-icon> }
      <span>{{ value }}</span>
    </span>
  `,
  styles: [`
    .tag {
      display: inline-flex;
      align-items: center;
      gap: .3rem;
      padding: .25rem .55rem;
      border-radius: 6px;
      font-size: .75rem;
      font-weight: 600;
      line-height: 1;
      white-space: nowrap;
    }
    .tag mat-icon {
      font-size: .9rem;
      width: .9rem;
      height: .9rem;
    }
    .tag--success  { background: #d1e7dd; color: #0f5132; }
    .tag--info     { background: var(--mat-sys-secondary-container); color: var(--mat-sys-on-secondary-container); }
    .tag--warn     { background: #fff4e5; color: #7c4a03; }
    .tag--danger   { background: var(--mat-sys-error-container); color: var(--mat-sys-on-error-container); }
    .tag--secondary,
    .tag--contrast { background: color-mix(in srgb, var(--mat-sys-on-surface) 12%, transparent); color: var(--mat-sys-on-surface); }
  `],
})
export class TagComponent {
  @Input() value = '';
  @Input() severity: Severity;
  @Input() icon?: string;
  @Input() styleClass = '';

  get severityClass(): string {
    return this.severity ? `tag--${this.severity}` : 'tag--secondary';
  }
}
