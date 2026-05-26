import { Component, inject, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import { CartStore } from '../state/cart.store';
import { ReservationService } from '../api/reservation.service';
import { ToastService } from '../../../shared/ui/toast/toast.service';

@Component({
  selector: 'app-checkout-flow',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  template: `
    <section class="max-w-4xl mx-auto p-6 md:p-10">
      <h1 class="text-3xl font-black text-slate-900 dark:text-white mb-8 tracking-tight">Checkout</h1>

      <div class="space-y-4 mb-8">
        @for (item of cart.items(); track item.event.id) {
          <div class="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between shadow-sm">
            <div>
              <h3 class="font-bold text-slate-900 dark:text-white">{{ item.event.name }}</h3>
              <p class="text-xs text-zinc-500 mt-1">{{ item.event.category }}</p>
            </div>
            <div class="flex items-center gap-4">
              <span class="font-mono font-bold text-slate-600 dark:text-zinc-400">{{ item.quantity }}x</span>
              <span class="font-black text-rose-600">{{ (item.event.price ?? 0) * item.quantity | currency:'BRL' }}</span>
            </div>
          </div>
        } @empty {
          <p class="text-zinc-500 text-center py-10">Seu carrinho está vazio.</p>
        }
      </div>

      <div class="mt-8 pt-8 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
        <div class="flex flex-col">
          <span class="text-xs uppercase tracking-widest text-zinc-500 font-bold">Total do Pedido</span>
          <span class="text-3xl font-black text-slate-900 dark:text-white">{{ cart.totalPrice() | currency:'BRL' }}</span>
        </div>

        <button
          (click)="handleCheckout()"
          [disabled]="isProcessing() || cart.items().length === 0"
          class="bg-rose-600 hover:bg-rose-700 text-white px-8 py-4 rounded-xl font-black transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-rose-600/20"
        >
          <svg *ngIf="isProcessing()" class="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v4m0 0l-2-2m2 2l2-2m-2 4v4m0 0l-2-2m2 2l2-2" />
          </svg>
          {{ isProcessing() ? 'Processando...' : 'Finalizar compra' }}
        </button>
      </div>
    </section>
  `
})
export class CheckoutFlowComponent {
  // Injeções
  protected readonly cart = inject(CartStore);
  private readonly reservationService = inject(ReservationService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);

  // Estados Locais
  protected readonly isProcessing = signal(false);

  protected handleCheckout(): void {
    const items = this.cart.items();
    if (items.length === 0) return;

    this.isProcessing.set(true);

    // Estrutura de reserva conforme contrato (singular: reserveTicket)
    // O payload envia o primeiro item ou uma lista dependendo do seu backend
    const payload = {
      eventId: items[0].event.id,
      quantity: items[0].quantity
    };

    this.reservationService.reserveTicket(payload).subscribe({
      next: () => {
        this.isProcessing.set(false);
        this.toast.show('Reserva realizada com sucesso!');
        this.cart.clear();
        this.router.navigate(['/orders/success']);
      },
      error: (err) => {
        this.isProcessing.set(false);
        this.toast.show(err.error?.message || 'Falha ao processar reserva.');
      }
    });
  }
}