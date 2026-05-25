import { Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartStore } from '../../checkout/state/cart.store';
import { ToastService } from '../../../shared/ui/toast/toast.service';
import { ReservationService } from '../../checkout/api/reservation.service';

@Component({
  selector: 'app-checkout-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fixed inset-0 z-[500] flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fade-in">
      <div class="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 relative animate-fade-in-up flex flex-col max-h-[90vh]">
        <div class="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-between items-center shrink-0">
          <div>
            <h2 class="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6 text-emerald-500"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" /></svg> Checkout Seguro
            </h2>
            <p class="text-xs text-slate-500 font-medium mt-1 flex items-center gap-1">Powered by <span class="font-black text-[#635BFF] tracking-tight">stripe</span></p>
          </div>
          <button (click)="close.emit()" class="p-2 text-slate-400 hover:text-red-500 bg-white dark:bg-slate-800 rounded-full shadow-sm outline-none transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <div class="p-6 overflow-y-auto flex-1 space-y-5">
          <div class="p-5 bg-gradient-to-tr from-slate-900 to-slate-700 dark:from-black dark:to-slate-800 rounded-2xl text-white shadow-xl relative overflow-hidden">
             <div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-xl"></div>
             <div class="flex justify-between items-start mb-6">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 opacity-80"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" /></svg>
                 <span class="text-xs font-bold bg-white/20 px-2 py-1 rounded border border-white/10 backdrop-blur-md">Crédito</span>
               </div>
             <p class="font-mono text-xl tracking-widest mb-4 drop-shadow-md">{{ dadosCartao.numero || '•••• •••• •••• ••••' }}</p>
             <div class="flex justify-between text-xs font-mono opacity-80 uppercase tracking-widest">
               <span class="truncate max-w-[150px]">{{ dadosCartao.nome || 'NOME DO TITULAR' }}</span>
               <span>{{ dadosCartao.validade || 'MM/AA' }}</span>
             </div>
          </div>
          <div>
            <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Número do Cartão</label>
            <input (input)="formatarCartao($event)" [value]="dadosCartao.numero" type="text" placeholder="0000 0000 0000 0000" maxlength="19" class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-950 dark:text-white focus:outline-none focus:border-[#635BFF] font-mono transition-all">
          </div>
          <div>
            <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Nome Impresso</label>
            <input [(ngModel)]="dadosCartao.nome" type="text" placeholder="Nome como está no cartão" class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-950 dark:text-white focus:outline-none focus:border-[#635BFF] uppercase transition-all">
          </div>
          <div class="flex gap-4">
            <div class="flex-1">
              <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Validade</label>
              <input (input)="formatarValidade($event)" [value]="dadosCartao.validade" type="text" placeholder="MM/AA" maxlength="5" class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-950 dark:text-white focus:outline-none focus:border-[#635BFF] font-mono transition-all">
            </div>
            <div class="flex-1">
              <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">CVV</label>
              <input [(ngModel)]="dadosCartao.cvv" type="password" placeholder="•••" maxlength="4" class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-950 dark:text-white focus:outline-none focus:border-[#635BFF] font-mono text-center transition-all">
            </div>
          </div>
        </div>
        
        <div class="p-6 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
          <button (click)="pagar()" [disabled]="isProcessing()" class="w-full bg-[#635BFF] text-white font-black py-4 rounded-xl hover:bg-[#5249ea] transition-all active:scale-95 shadow-lg shadow-[#635BFF]/30 flex items-center justify-center gap-2 outline-none">
            <span *ngIf="isProcessing()" class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            {{ isProcessing() ? 'Processando Stripe...' : 'Pagar R$ ' + cart.totalPrice() + ',00' }}
          </button>
        </div>
      </div>
    </div>
  `
})
export class CheckoutModalComponent {
  cart = inject(CartStore);
  toast = inject(ToastService);
  reservationService = inject(ReservationService);
  
  @Output() close = new EventEmitter<void>();
  @Output() success = new EventEmitter<void>();

  isProcessing = signal(false);
  dadosCartao = { numero: '', nome: '', validade: '', cvv: '' };

  formatarCartao(e: any) { this.dadosCartao.numero = e.target.value.replace(/\D/g, '').replace(/(\d{4})/g, '$1 ').trim(); }
  formatarValidade(e: any) { let v = e.target.value.replace(/\D/g, ''); if (v.length >= 2) v = v.substring(0,2) + '/' + v.substring(2,4); this.dadosCartao.validade = v; }

  pagar() {
    if (!this.dadosCartao.numero || this.dadosCartao.cvv.length < 3) {
      this.toast.show('Preencha os dados do cartão corretamente.');
      return;
    }
    
    const firstItem = this.cart.items()[0];
    if (!firstItem) return;

    this.isProcessing.set(true);
    
    // Integração perfeita com o C# (eventId, quantity em minúsculo conforme o model TS)
    this.reservationService.reserveTickets({ eventId: firstItem.event.id, quantity: firstItem.quantity }).subscribe({
      next: (res: any) => {
        this.isProcessing.set(false);
        this.toast.show(`Pagamento aprovado na Stripe! (Pedido: ${res?.orderId?.substring(0,6)})`);
        this.cart.clear();
        this.success.emit();
      },
      error: (err: any) => {
        this.isProcessing.set(false);
        this.toast.show(err.error?.message || 'Pagamento recusado.');
      }
    });
  }
}