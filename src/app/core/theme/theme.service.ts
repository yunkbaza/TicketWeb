import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  readonly darkMode = signal(false);

  constructor() {
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'dark') {
      this.enableDarkMode();
    }
  }

  toggle(): void {
    this.darkMode()
      ? this.disableDarkMode()
      : this.enableDarkMode();
  }

  private enableDarkMode(): void {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
    this.darkMode.set(true);
  }

  private disableDarkMode(): void {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
    this.darkMode.set(false);
  }
}