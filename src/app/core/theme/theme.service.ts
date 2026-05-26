import { Injectable, signal, effect } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  public readonly isDark = signal(localStorage.getItem('theme') === 'dark');

  constructor() {
    effect(() => {
      const isDark = this.isDark();
      document.documentElement.classList.toggle('dark', isDark);
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
  }

  toggle(): void {
    this.isDark.update(v => !v);
  }
}