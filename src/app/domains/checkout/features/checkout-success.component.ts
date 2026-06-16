import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartStore } from '../state/cart.store';
import { LanguageService } from '../../../core/i18n/language.service';

@Component({
  selector: 'app-checkout-success',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-md mx-auto my-20 p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl text-center flex flex-col items-center animate-fade-in-up">
      <div class="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-inner">
        <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg>
      </div>
      
      <h1 class="text-2xl font-black text-slate-900 dark:text-white mb-2">
        {{ lang.currentLang() === 'PT' ? 'Pagamento Confirmado!' : 'Payment Confirmed!' }}
      </h1>
      
      <p class="text-slate-500 text-sm mb-8">
        {{ lang.currentLang() === 'PT' ? 'Sua reserva definitiva foi garantida e o ingresso já é seu.' : 'Your reservation is secured and the ticket is yours.' }}
      </p>
      
      <button (click)="finish()" class="w-full bg-[#780a43] hover:bg-[#600835] text-white font-black py-4 rounded-xl transition-all active:scale-95 shadow-lg shadow-[#780a43]/20 outline-none">
        {{ lang.currentLang() === 'PT' ? 'Voltar para a Vitrine' : 'Back to Events' }}
      </button>
    </div>
  `
})
export class CheckoutSuccessComponent implements OnInit {
  private readonly router = inject(Router);
  public readonly cart = inject(CartStore);
  public readonly lang = inject(LanguageService);

  ngOnInit(): void {
    // 🔥 Na arquitetura Sênior SAGA, o "Lock" atômico no MongoDB já foi feito 
    // lá na Sidebar antes de abrir o Stripe. 
    // Aqui, nós apenas esvaziamos a sacolinha (estado visual) e celebramos!
    this.cart.clear();
  }

  finish(): void {
    this.router.navigate(['/']);
  }
}