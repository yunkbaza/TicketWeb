import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CartStore } from '../state/cart.store';
import { ReservationService } from '../api/reservation.service';

@Component({
  selector: 'app-checkout-flow',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="max-w-4xl mx-auto p-10">
      <h1 class="text-3xl font-bold text-white mb-8">
        Checkout
      </h1>

      <div class="space-y-4">
        @for (item of cart.items(); track item.eventId) {
        <div class="bg-zinc-900 rounded-2xl p-4 border border-zinc-800">
          <div class="flex items-center justify-between">
            <span class="text-white">{{ item.title }}</span>
            <span class="text-zinc-400">
              {{ item.quantity }}x
            </span>
          </div>
        </div>
        }
      </div>

      <div class="mt-8 flex items-center justify-between">
        <span class="text-2xl font-bold text-white">
          {{ cart.total() | currency:'BRL' }}
        </span>

        <button
          (click)="reserve()"
          class="bg-emerald-500 px-6 py-3 rounded-xl font-semibold text-black"
        >
          Finalizar compra
        </button>
      </div>
    </section>
  `
})
export class CheckoutFlowComponent {
  readonly cart = inject(CartStore);

  private readonly reservationService = inject(ReservationService);

  reserve(): void {
    this.reservationService
      .reserveTickets({
        items: this.cart.items()
      })
      .subscribe();
  }
}