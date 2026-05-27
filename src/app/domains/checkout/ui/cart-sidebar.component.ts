import { Component, inject, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { CartStore } from '../state/cart.store';
import { ReservationService } from '../api/reservation.service';
import { ToastService } from '../../../shared/ui/toast/toast.service';
import { LanguageService } from '../../../core/i18n/language.service';

@Component({
  selector: 'app-cart-sidebar',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  template: `
    <div *ngIf="cart.isSidebarOpen()" 
         (click)="cart.closeSidebar()"
         class="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[190] transition-opacity duration-300 animate-fade-in">
    </div>

    <div class="fixed inset-y-0 right-0 z-[200] w-full md:w-[450px] bg-white dark:bg-slate-950 shadow-2xl border-l border-slate-200 dark:border-slate-800 transform transition-transform duration-300 flex flex-col"
         [ngClass]="cart.isSidebarOpen() ? 'translate-x-0' : 'translate-x-full'">
      
      <div class="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
        <h2 class="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <svg class="w-6 h-6 text-[#780a43]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
          {{ lang.currentLang() === 'PT' ? 'Seu Carrinho' : 'Your Cart' }}
        </h2>
        <button (click)="cart.closeSidebar()" class="text-slate-400 hover:text-rose-500 transition-colors outline-none bg-slate-100 dark:bg-slate-900 p-2 rounded-full">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <div class="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50 dark:bg-slate-950/50">
        @for (item of cart.items(); track item.event.id) {
          <div class="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-sm animate-fade-in-up">
            <div>
              <h3 class="font-bold text-slate-900 dark:text-white leading-tight">{{ item.event.name }}</h3>
              <p class="text-[10px] uppercase font-bold tracking-widest text-slate-500 mt-1">{{ item.event.category }}</p>
            </div>
            <div class="flex flex-col items-end">
              <span class="font-black text-[#780a43]">{{ (item.event.price ?? 0) * item.quantity | currency:'BRL' }}</span>
              <span class="text-xs font-mono font-bold text-slate-400">Qtd: {{ item.quantity }}</span>
            </div>
          </div>
        } @empty {
          <div class="text-center py-20 flex flex-col items-center justify-center h-full">
            <svg class="w-16 h-16 text-slate-300 dark:text-slate-700 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            <p class="text-slate-500 font-medium">{{ lang.currentLang() === 'PT' ? 'O carrinho está vazio.' : 'Cart is empty.' }}</p>
          </div>
        }
      </div>

      <div *ngIf="cart.items().length > 0" class="p-6 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
        <div class="flex justify-between items-end mb-6">
          <span class="text-xs font-bold uppercase tracking-widest text-slate-500">{{ lang.currentLang() === 'PT' ? 'Total a Pagar' : 'Total' }}</span>
          <span class="text-3xl font-black text-slate-900 dark:text-white">{{ cart.totalPrice() | currency:'BRL' }}</span>
        </div>

        <button (click)="handleCheckout()" [disabled]="isProcessing()"
                class="w-full bg-[#780a43] hover:bg-[#600835] text-white py-4 rounded-xl font-black transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-[#780a43]/20 outline-none">
          <svg *ngIf="isProcessing()" class="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          {{ isProcessing() ? (lang.currentLang() === 'PT' ? 'Processando...' : 'Processing...') : (lang.currentLang() === 'PT' ? 'Confirmar Reserva' : 'Confirm Reservation') }}
        </button>
      </div>
    </div>
  `
})
export class CartSidebarComponent {
  public readonly cart = inject(CartStore);
  public readonly lang = inject(LanguageService);
  private readonly reservationService = inject(ReservationService);
  private readonly toast = inject(ToastService);

  public isProcessing = signal(false);

  handleCheckout(): void {
    const items = this.cart.items();
    if (items.length === 0) return;

    this.isProcessing.set(true);

    const payload = {
      eventId: items[0].event.id,
      quantity: items[0].quantity
    };

    this.reservationService.reserveTicket(payload).subscribe({
      next: () => {
        this.isProcessing.set(false);
        this.toast.show(this.lang.currentLang() === 'PT' ? '🎉 Reserva efetuada com sucesso!' : '🎉 Reservation successful!');
        this.cart.clear();
        this.cart.closeSidebar();
      },
      error: (err) => {
        this.isProcessing.set(false);
        const errorMsg = err.error?.message || (this.lang.currentLang() === 'PT' ? 'Erro ao processar reserva.' : 'Error processing reservation.');
        this.toast.show(`❌ ${errorMsg}`);
      }
    });
  }
}