import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  public readonly currentLang = signal<'PT' | 'EN'>((localStorage.getItem('lang') as 'PT' | 'EN') || 'PT');

  toggle(): void {
    const next = this.currentLang() === 'PT' ? 'EN' : 'PT';
    this.currentLang.set(next);
    localStorage.setItem('lang', next);
  }
}