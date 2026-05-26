import { Component, EventEmitter, Output, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartStore } from '../state/cart.store';
import { ReservationService } from '../api/reservation.service';
import { ToastService } from '../../../shared/ui/toast/toast.service';

@Component({
  selector: 'app-checkout-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fixed inset-0 z-[500] flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fade-in">
      <div class="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-8">
        
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-black text-slate-900 dark:text-white">Checkout Seguro</h2>
          <button (click)="close.emit()" class="text-slate-400 hover:text-rose-500 transition-colors">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div class="space-y-4 mb-6">
          <div class="flex justify-between text-sm font-medium">
            <span class="text-slate-500">Total a pagar:</span>
            <span class="font-black text-lg">{{ cart.totalPrice() | currency:'BRL' }}</span>
          </div>
        </div>

        <button (click)="submit()" 
                [disabled]="isProcessing()"
                class="w-full bg-rose-600 hover:bg-rose-700 text-white font-black py-4 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2">
          <svg *ngIf="isProcessing()" class="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          {{ isProcessing() ? 'Processando...' : 'Confirmar Reserva' }}
        </button>
      </div>
    </div>
  `
})
export class CheckoutModalComponent {
  // Injeções
  private readonly cart = inject(CartStore);
  private readonly reservationService = inject(ReservationService);
  private readonly toast = inject(ToastService);

  @Output() close = new EventEmitter<void>();
  @Output() success = new EventEmitter<void>();

  // Estados
  protected isProcessing = signal(false);

  // Computed para facilitar uso no template se necessário
  protected totalPrice = computed(() => this.cart.totalPrice());

  protected submit(): void {
    const items = this.cart.items();
    if (items.length === 0) return;

    this.isProcessing.set(true);

    this.reservationService.reserveTicket({
      eventId: items[0].event.id,
      quantity: items[0].quantity
    }).subscribe({
      next: () => {
        this.isProcessing.set(false);
        this.toast.show('Reserva confirmada com sucesso!');
        this.cart.clear();
        this.success.emit();
        this.close.emit();
      },
      error: (err) => {
        this.isProcessing.set(false);
        this.toast.show(err.error?.message || 'Falha na reserva.');
      }
    });
  }
}