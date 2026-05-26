import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../core/theme/theme.service';
import { LanguageService } from '../core/i18n/language.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="fixed top-0 w-full z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800">
      <nav class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <a href="#" class="text-2xl font-black tracking-tighter text-rose-600">BAZA<span class="text-zinc-900 dark:text-white">TICKET</span></a>
        
        <div class="flex items-center gap-4">
          <button (click)="lang.toggle()" class="text-xs font-bold px-3 py-1 rounded-full border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all">
            {{ lang.currentLang() }}
          </button>
          
          <button (click)="theme.toggle()" class="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-full transition-all">
            <svg *ngIf="!theme.isDark()" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            <svg *ngIf="theme.isDark()" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
          </button>
        </div>
      </nav>
    </header>
  `
})
export class NavbarComponent {
  protected theme = inject(ThemeService);
  protected lang = inject(LanguageService);
}