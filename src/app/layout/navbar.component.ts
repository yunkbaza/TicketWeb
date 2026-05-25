import { Component, EventEmitter, Output, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../../core/services/cart.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <nav class="fixed top-0 w-full z-[100] bg-white/95 dark:bg-slate-950/90 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-800/50 transition-all shadow-sm">
      <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 h-20 flex items-center justify-between gap-4">
        
        <div class="flex items-center gap-2.5 shrink-0 cursor-pointer group" (click)="resetSearch.emit()">
          <div class="w-9 h-9 bg-rose-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform shadow-lg shadow-rose-600/20">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 text-white"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z" /></svg>
          </div>
          <h1 class="text-2xl font-black tracking-tighter text-slate-950 dark:text-white hidden sm:block">BAZA<span class="text-rose-600 dark:text-rose-500">TICKET</span></h1>
        </div>
        
        <div class="hidden md:flex flex-1 max-w-3xl items-center gap-2">
          <div class="flex items-center bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full px-5 py-2.5 w-full focus-within:ring-2 focus-within:ring-rose-500 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 text-slate-400 mr-2"><path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
            <input [ngModel]="termoBusca" (ngModelChange)="termoBuscaChange.emit($event)" type="text" placeholder="Busque shows..." class="bg-transparent border-none outline-none text-sm w-full text-slate-950 dark:text-white placeholder-slate-500">
          </div>
        </div>

        <div class="flex items-center gap-3 shrink-0">
          <button (click)="toggleTheme.emit()" class="p-2 text-slate-600 dark:text-slate-300 hover:text-rose-600 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 outline-none">
            <svg *ngIf="!isDarkMode" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" /></svg>
            <svg *ngIf="isDarkMode" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" /></svg>
          </button>

          <button (click)="openCart.emit()" class="relative p-2 text-slate-600 dark:text-slate-300 hover:text-rose-600 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" /></svg>
            <span *ngIf="cart.totalItems() > 0" class="absolute top-0 right-0 w-4 h-4 bg-rose-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">{{ cart.totalItems() }}</span>
          </button>

          <ng-container *ngIf="!auth.isLoggedIn()">
            <button (click)="openLogin.emit('login')" class="text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-rose-600 transition-colors">Entrar</button>
            <button (click)="openLogin.emit('register')" class="bg-rose-600 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-rose-700 transition-all shadow-sm">Criar Conta</button>
          </ng-container>

          <div *ngIf="auth.isLoggedIn()" class="w-10 h-10 bg-gradient-to-tr from-rose-500 to-orange-400 rounded-full shadow-md flex items-center justify-center cursor-pointer" (click)="auth.logout()">
            <span class="text-white font-bold text-sm">V</span>
          </div>
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent {
  auth = inject(AuthService);
  cart = inject(CartService);
  
  @Input() termoBusca = '';
  @Input() isDarkMode = false;
  
  @Output() termoBuscaChange = new EventEmitter<string>();
  @Output() toggleTheme = new EventEmitter<void>();
  @Output() openCart = new EventEmitter<void>();
  @Output() openLogin = new EventEmitter<'login' | 'register'>();
  @Output() resetSearch = new EventEmitter<void>();
}