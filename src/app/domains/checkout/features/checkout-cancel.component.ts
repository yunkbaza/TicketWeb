import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiClient } from '../../../core/http/api-client.service';
import { ToastService } from '../../../shared/ui/toast/toast.service';

@Component({
  selector: 'app-checkout-cancel',
  standalone: true,
  template: `
    <div class="flex items-center justify-center min-h-[60vh]">
      <div class="text-center animate-fade-in-up">
        <svg class="w-20 h-20 text-rose-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h1 class="text-3xl font-black text-slate-900 dark:text-white mb-2">Compra Cancelada</h1>
        <p class="text-slate-500 mb-6">Sua reserva foi desfeita e os ingressos devolvidos ao lote.</p>
      </div>
    </div>
  `
})

export class CheckoutCancelComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private api = inject(ApiClient);
  private toast = inject(ToastService);

  ngOnInit() {
    const eventId = this.route.snapshot.queryParamMap.get('eventId');
    const quantity = this.route.snapshot.queryParamMap.get('quantity');

    if (eventId && quantity) {
      // ♻️ Dispara o Rollback no Backend via Gateway!
      this.api.delete(`/api/reservations/${eventId}/${quantity}`).subscribe({
        next: () => {
          this.toast.show('⚠️ Ingresso liberado para outros usuários.');
          setTimeout(() => this.router.navigate(['/']), 3500);
        }
      });
    } else {
      this.router.navigate(['/']);
    }
  }
  
}