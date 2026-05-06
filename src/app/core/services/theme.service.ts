import { Injectable, signal } from '@angular/core';

const STORAGE_KEY = 'stockmarket_theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly isDark = signal<boolean>(this.loadPreference());

  toggle(): void {
    this.isDark.set(!this.isDark());
    this.apply(this.isDark());
    localStorage.setItem(STORAGE_KEY, this.isDark() ? 'dark' : 'light');
  }

  init(): void {
    this.apply(this.isDark());
  }

  private apply(dark: boolean): void {
    document.documentElement.classList.toggle('dark-mode', dark);
  }

  private loadPreference(): boolean {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return stored === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
}
