import { Injectable, signal } from '@angular/core';
import { StorageKeys, ThemeValues } from '../constants/app.constants';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly isDark = signal<boolean>(this.loadPreference());

  toggle(): void {
    this.isDark.set(!this.isDark());
    this.apply(this.isDark());
    localStorage.setItem(StorageKeys.Theme, this.isDark() ? ThemeValues.Dark : ThemeValues.Light);
  }

  init(): void {
    this.apply(this.isDark());
  }

  private apply(dark: boolean): void {
    document.documentElement.classList.toggle(ThemeValues.DarkModeClass, dark);
  }

  private loadPreference(): boolean {
    const stored = localStorage.getItem(StorageKeys.Theme);
    if (stored) return stored === ThemeValues.Dark;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
}
