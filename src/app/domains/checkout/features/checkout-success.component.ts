import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ReservationService } from '../api/reservation.service';
import { ToastService } from '../../../shared/ui/toast/toast.service';
import { CartStore } from '../state/cart.store';

@Component({
  selector: 'app-checkout-success',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-md mx-auto my-20 p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl text-center flex flex-col items-center">
      <div class="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 rounded-full flex items-center justify-center mb-6">
        <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg>
      </div>
      <h1 class="text-2xl font-black text-slate-900 dark:text-white mb-2">Pagamento Confirmado!</h1>
      <p class="text-slate-500 text-sm mb-8">Sua reserva foi processada e o lote atômico foi garantido no ecossistema distributed .NET.</p>
      <button (click)="finish()" class="w-full bg-[#780a43] hover:bg-[#600835] text-white font-black py-4 rounded-xl transition-all">
        Voltar para a Vitrine
      </button>
    </div>
  `
})
export class CheckoutSuccessComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly reservationService = inject(ReservationService);
  private readonly toast = inject(ToastService);
  private readonly cart = inject(CartStore);

  ngOnInit(): void {
    this.cart.clear();
    const eventId = this.route.snapshot.queryParamMap.get('eventId');
    const quantityStr = this.route.snapshot.queryParamMap.get('quantity');

    if (eventId && quantityStr) {
      const payload = {
        eventId: eventId,
        quantity: parseInt(quantityStr, 10)
      };

      this.reservationService.reserveTicket(payload).subscribe({
        next: () => {
          this.toast.show('🎉 Transação efetuada com sucesso! Ingresso emitido.');
        },
        error: () => {
          this.toast.show('⚠️ Falha ao sincronizar o lote atômico no banco distribuído.');
        }
      });
    }
  }

  finish(): void {
    this.router.navigate(['/']);
  }
}