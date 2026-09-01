import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

type Severity = 'error' | 'warn' | 'info' | 'success';

/** Replacement for <p-message> — an inline coloured notice with an icon. */
@Component({
  selector: 'app-inline-message',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule],
  template: `
    <div class="msg" [class]="'msg--' + severity" role="alert">
      <mat-icon>{{ icon }}</mat-icon>
      <span>{{ text }}</span>
    </div>
  `,
  styles: [`
    .msg {
      display: flex;
      align-items: center;
      gap: .5rem;
      padding: .625rem .875rem;
      border-radius: 8px;
      font-size: .875rem;
      line-height: 1.4;
      border: 1px solid transparent;
    }
    .msg mat-icon {
      font-size: 1.125rem;
      width: 1.125rem;
      height: 1.125rem;
      flex-shrink: 0;
    }
    .msg--error {
      color: var(--mat-sys-on-error-container);
      background: var(--mat-sys-error-container);
      border-color: color-mix(in srgb, var(--mat-sys-error) 40%, transparent);
    }
    .msg--warn {
      color: #7c4a03;
      background: #fff4e5;
      border-color: #f5c37b;
    }
    .msg--info {
      color: var(--mat-sys-on-secondary-container);
      background: var(--mat-sys-secondary-container);
      border-color: color-mix(in srgb, var(--mat-sys-secondary) 40%, transparent);
    }
    .msg--success {
      color: #0f5132;
      background: #d1e7dd;
      border-color: #a3cfbb;
    }
  `],
})
export class InlineMessageComponent {
  @Input() severity: Severity = 'info';
  @Input() text = '';

  get icon(): string {
    switch (this.severity) {
      case 'error': return 'error';
      case 'warn': return 'warning';
      case 'success': return 'check_circle';
      default: return 'info';
    }
  }
}
