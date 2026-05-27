import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../core/theme/theme.service';
import { LanguageService } from '../core/i18n/language.service';
import { CatalogStore } from '../domains/catalog/state/catalog.store';
import { CartStore } from '../domains/checkout/state/cart.store';
import { AuthService } from '../core/auth/auth.service';
import { ToastService } from '../shared/ui/toast/toast.service';
import { AuthModalComponent } from '../shared/ui/auth-modal.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule, AuthModalComponent],
  template: `
    <app-auth-modal *ngIf="showAuthModal()" [mode]="authMode()" (close)="showAuthModal.set(false)"></app-auth-modal>

    <header class="fixed top-0 w-full z-50 bg-white/90 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-800/50 transition-all duration-300">
      <nav class="max-w-[1600px] mx-auto px-6 h-20 flex items-center justify-between gap-6">
        
        <div class="flex items-center shrink-0 cursor-pointer">
          <img src="/Logo_BazaTicket.png" alt="BazaTicket Logo" class="h-8 md:h-10 w-auto transition-transform hover:scale-105 drop-shadow-sm">
        </div>
        
        <div class="hidden md:flex flex-1 max-w-2xl items-center">
          <div class="flex items-center bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full px-5 py-2.5 w-full focus-within:ring-2 focus-within:ring-[#780a43] transition-all">
            <svg class="w-4 h-4 text-slate-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input [ngModel]="catalog.searchQuery()" 
                   (ngModelChange)="catalog.setSearchQuery($event)" 
                   type="text" 
                   [placeholder]="lang.t().nav.searchPlaceholder" 
                   class="bg-transparent border-none outline-none text-sm w-full text-slate-950 dark:text-white placeholder-slate-400">
          </div>
        </div>

        <div class="flex items-center gap-4 shrink-0">
          <button (click)="lang.toggle()" class="text-xs font-black px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors uppercase">
            {{ lang.currentLang() }}
          </button>

          <button (click)="theme.toggle()" class="p-2 text-slate-600 dark:text-slate-300 hover:text-[#780a43] transition-colors rounded-full outline-none">
            <svg *ngIf="!theme.isDark()" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
            <svg *ngIf="theme.isDark()" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
          </button>

          <div class="relative p-2 text-slate-600 dark:text-slate-300 cursor-pointer">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            <span *ngIf="cart.totalItems() > 0" class="absolute top-0 right-0 w-4 h-4 bg-[#780a43] text-white text-[9px] font-black rounded-full flex items-center justify-center animate-bounce">
              {{ cart.totalItems() }}
            </span>
          </div>

          <div class="flex items-center gap-2 border-l border-slate-200 dark:border-slate-800 pl-4">
            @if (!auth.isLoggedIn()) {
              <button (click)="openAuthModal('login')" class="text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-[#780a43] transition-colors px-3 py-2">{{ lang.t().nav.loginBtn }}</button>
              <button (click)="openAuthModal('register')" class="bg-[#780a43] text-white px-5 py-2.5 rounded-full text-sm font-black hover:bg-[#600835] transition-all shadow-md shadow-[#780a43]/20">{{ lang.t().nav.registerBtn }}</button>
            } @else {
              <div class="flex items-center gap-4">
                <div class="flex flex-col text-right hidden md:flex">
                  <span class="text-[10px] font-black uppercase tracking-widest text-[#780a43]">Logado</span>
                  <span class="text-sm font-bold text-slate-900 dark:text-white">{{ auth.currentUser()?.name }}</span>
                </div>
                <button (click)="handleLogout()" class="w-10 h-10 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition-colors">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                </button>
              </div>
            }
          </div>
        </div>
      </nav>
    </header>
  `
})
export class NavbarComponent {
  protected readonly theme = inject(ThemeService);
  protected readonly lang = inject(LanguageService);
  protected readonly catalog = inject(CatalogStore);
  protected readonly cart = inject(CartStore);
  public readonly auth = inject(AuthService);
  private readonly toast = inject(ToastService);

  public readonly showAuthModal = signal(false);
  public readonly authMode = signal<'login' | 'register'>('login');

  // Método que configura o modal antes de abri-lo
  protected openAuthModal(mode: 'login' | 'register') {
    this.authMode.set(mode);
    this.showAuthModal.set(true);
  }

  protected handleLogout() {
    this.auth.logout();
    this.toast.show(this.lang.currentLang() === 'PT' ? 'Você saiu da conta.' : 'You logged out.');
  }
}