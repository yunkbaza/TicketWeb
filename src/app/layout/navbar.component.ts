import { Component, computed, inject, signal } from '@angular/core';
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
  imports: [
    CommonModule,
    FormsModule,
    AuthModalComponent
  ],
  template: `
    <!-- AUTH MODAL -->
    <app-auth-modal
      *ngIf="showAuthModal()"
      (close)="closeAuthModal()">
    </app-auth-modal>

    <!-- NAVBAR -->
    <header
      class="fixed top-0 left-0 w-full z-50
             bg-white/90 dark:bg-slate-950/80
             backdrop-blur-2xl
             border-b border-slate-200/60 dark:border-slate-800/50
             transition-all duration-300">

      <nav
        class="max-w-[1600px] mx-auto
               px-4 sm:px-6 lg:px-8
               h-20
               flex items-center justify-between gap-6">

        <!-- LEFT -->
        <div class="flex items-center gap-10 flex-1">

          <!-- LOGO -->
          <button
            type="button"
            (click)="scrollToTop()"
            class="shrink-0 group outline-none">

            <h1
              class="text-2xl md:text-3xl
                     font-black tracking-[-0.08em]
                     text-slate-950 dark:text-white
                     transition-all duration-300
                     group-hover:opacity-90">

              BAZA<span class="text-[#780a43]">TICKET</span>
            </h1>
          </button>

          <!-- SEARCH -->
          <div class="hidden lg:flex flex-1 max-w-2xl">
            <div
              class="flex items-center
                     w-full
                     bg-slate-100 dark:bg-slate-900
                     border border-slate-200 dark:border-slate-800
                     rounded-full
                     px-5 py-3
                     transition-all duration-300
                     focus-within:ring-2
                     focus-within:ring-[#780a43]
                     focus-within:border-transparent">

              <!-- SEARCH ICON -->
              <svg
                class="w-4 h-4 text-slate-400 mr-3 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">

                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2.5"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>

              <input
                type="text"
                [ngModel]="catalog.searchQuery()"
                (ngModelChange)="onSearch($event)"
                [placeholder]="translations().nav.searchPlaceholder"
                class="w-full bg-transparent outline-none border-none
                       text-sm font-medium
                       text-slate-900 dark:text-white
                       placeholder:text-slate-400 dark:placeholder:text-slate-500" />
            </div>
          </div>
        </div>

        <!-- RIGHT -->
        <div class="flex items-center gap-2 md:gap-4 shrink-0">

          <!-- LANGUAGE -->
          <button
            type="button"
            (click)="toggleLanguage()"
            class="hidden sm:flex items-center justify-center
                   min-w-[56px]
                   h-10
                   px-3
                   rounded-full
                   border border-slate-200 dark:border-slate-800
                   bg-white dark:bg-slate-900
                   text-xs font-black uppercase tracking-wider
                   text-slate-700 dark:text-slate-200
                   hover:border-[#780a43]
                   hover:text-[#780a43]
                   transition-all duration-300">

            {{ lang.currentLang() }}
          </button>

          <!-- THEME -->
          <button
            type="button"
            (click)="toggleTheme()"
            class="w-10 h-10
                   rounded-full
                   flex items-center justify-center
                   border border-transparent
                   hover:border-slate-200
                   dark:hover:border-slate-800
                   hover:bg-slate-100
                   dark:hover:bg-slate-900
                   transition-all duration-300">

            <!-- MOON -->
            <svg
              *ngIf="!theme.isDark()"
              class="w-5 h-5 text-slate-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">

              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M20.354 15.354A9 9 0 018.646 3.646
                   9.003 9.003 0 0012 21
                   a9.003 9.003 0 008.354-5.646z"/>
            </svg>

            <!-- SUN -->
            <svg
              *ngIf="theme.isDark()"
              class="w-5 h-5 text-yellow-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">

              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 3v1m0 16v1m9-9h-1M4 12H3
                   m15.364 6.364l-.707-.707
                   M6.343 6.343l-.707-.707
                   m12.728 0l-.707.707
                   M6.343 17.657l-.707.707
                   M16 12a4 4 0 11-8 0
                   4 4 0 018 0z"/>
            </svg>
          </button>

          <!-- CART -->
          <button
            type="button"
            class="relative
                   w-11 h-11
                   rounded-full
                   flex items-center justify-center
                   hover:bg-slate-100
                   dark:hover:bg-slate-900
                   transition-all duration-300">

            <svg
              class="w-6 h-6 text-slate-700 dark:text-slate-200"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">

              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 11V7a4 4 0 00-8 0v4
                   M5 9h14l1 12H4L5 9z"/>
            </svg>

            <!-- BADGE -->
            <span
              *ngIf="cart.totalItems() > 0"
              class="absolute
                     -top-1 -right-1
                     min-w-[20px]
                     h-5
                     px-1
                     rounded-full
                     bg-[#780a43]
                     text-white
                     text-[10px]
                     font-black
                     flex items-center justify-center">

              {{ cart.totalItems() }}
            </span>
          </button>

          <!-- DIVIDER -->
          <div class="hidden md:block w-px h-8 bg-slate-200 dark:bg-slate-800"></div>

          <!-- AUTH -->
          @if (!auth.isLoggedIn()) {

            <div class="flex items-center gap-2">

              <!-- LOGIN -->
              <button
                type="button"
                (click)="openAuthModal('login')"
                class="hidden sm:flex
                       px-4 py-2
                       text-sm font-bold
                       text-slate-700 dark:text-slate-300
                       hover:text-[#780a43]
                       transition-colors">

                {{ translations().nav.loginBtn }}
              </button>

              <!-- REGISTER -->
              <button
                type="button"
                (click)="openAuthModal('register')"
                class="h-11
                       px-5
                       rounded-full
                       bg-[#780a43]
                       text-white
                       text-sm font-black
                       tracking-wide
                       hover:bg-[#5f0834]
                       transition-all duration-300
                       shadow-lg shadow-[#780a43]/20">

                {{ translations().nav.registerBtn }}
              </button>
            </div>

          } @else {

            <div class="flex items-center gap-3">

              <!-- USER INFO -->
              <div class="hidden md:flex flex-col text-right">
                <span
                  class="text-[10px]
                         uppercase tracking-[0.2em]
                         font-black
                         text-[#780a43]">

                  ONLINE
                </span>

                <span
                  class="text-sm font-bold
                         text-slate-900 dark:text-white">

                  {{ currentUserName() }}
                </span>
              </div>

              <!-- AVATAR -->
              <div
                class="w-10 h-10
                       rounded-full
                       bg-[#780a43]
                       text-white
                       flex items-center justify-center
                       font-black
                       text-sm">

                {{ userInitials() }}
              </div>

              <!-- LOGOUT -->
              <button
                type="button"
                (click)="handleLogout()"
                class="w-10 h-10
                       rounded-full
                       flex items-center justify-center
                       text-rose-500
                       hover:bg-rose-50
                       dark:hover:bg-rose-950/30
                       transition-all duration-300">

                <svg
                  class="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">

                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17 16l4-4m0 0l-4-4
                       m4 4H7m6 4v1a3 3 0 01-3 3H6
                       a3 3 0 01-3-3V7a3 3 0 013-3h4
                       a3 3 0 013 3v1"/>
                </svg>
              </button>
            </div>
          }
        </div>
      </nav>
    </header>
  `
})
export class NavbarComponent {

  // SERVICES
  protected readonly theme = inject(ThemeService);
  protected readonly lang = inject(LanguageService);
  protected readonly catalog = inject(CatalogStore);
  protected readonly cart = inject(CartStore);

  public readonly auth = inject(AuthService);

  private readonly toast = inject(ToastService);

  // STATE
  public readonly showAuthModal = signal(false);

  public readonly authMode = signal<'login' | 'register'>('login');

  // COMPUTED
  protected readonly translations = computed(() => this.lang.t());

  protected readonly currentUserName = computed(() => {
    return this.auth.currentUser()?.name ?? 'Allan';
  });

  protected readonly userInitials = computed(() => {
    const name = this.currentUserName();

    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  });

  // SEARCH
  protected onSearch(value: string): void {
    this.catalog.setSearchQuery(value);
  }

  // LANGUAGE
  protected toggleLanguage(): void {
    this.lang.toggle();

    const isPT = this.lang.currentLang() === 'PT';

    this.toast.show(
      isPT
        ? 'Idioma alterado para Português.'
        : 'Language changed to English.'
    );
  }

  // THEME
  protected toggleTheme(): void {
    this.theme.toggle();

    const isDark = this.theme.isDark();

    this.toast.show(
      isDark
        ? 'Modo escuro ativado.'
        : 'Light mode activated.'
    );
  }

  // AUTH MODAL
  protected openAuthModal(mode: 'login' | 'register'): void {
    this.authMode.set(mode);
    this.showAuthModal.set(true);
  }

  protected closeAuthModal(): void {
    this.showAuthModal.set(false);
  }

  // LOGOUT
  protected handleLogout(): void {
    this.auth.logout();

    this.toast.show(
      this.lang.currentLang() === 'PT'
        ? 'Você saiu da conta.'
        : 'You logged out.'
    );
  }

  // SCROLL
  protected scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}