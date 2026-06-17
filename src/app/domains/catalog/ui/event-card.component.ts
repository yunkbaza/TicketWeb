import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, inject, effect, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventTicket } from '../models/event-ticket.model';
import { CartStore } from '../../checkout/state/cart.store';
import { SignalRService } from '../../../core/signalr/signalr.service';

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="group flex flex-col bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 hover:shadow-2xl dark:hover:shadow-rose-900/10 transition-all duration-500 h-full p-2">
      
      <div class="relative w-full aspect-[4/3] bg-slate-100 dark:bg-slate-800 overflow-hidden rounded-2xl">
        <div class="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent z-10"></div>
        <img [src]="getImagem(event.category || 'Todos')" 
             [alt]="'Imagem ilustrativa do evento ' + event.name"
             loading="lazy"
             class="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out">
        
        <div class="absolute top-3 right-3 z-20 backdrop-blur-md bg-white/20 dark:bg-black/30 border border-white/20 text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
          {{ event.category }}
        </div>
        
        <div *ngIf="event.availableTickets === 0 || event.isSoldOut" class="absolute inset-0 bg-slate-950/70 backdrop-blur-sm z-20 flex items-center justify-center animate-fade-in">
          <span class="bg-red-600 text-white font-black px-6 py-2 rounded-xl text-lg uppercase tracking-widest shadow-2xl border border-red-500 -rotate-6">Esgotado</span>
        </div>
      </div>

      <div class="px-4 py-5 flex-1 flex flex-col">
        <h4 class="text-lg font-black text-slate-900 dark:text-white leading-tight mb-2 line-clamp-2" [title]="event.name">{{ event.name }}</h4>
        
        <div class="flex items-center text-xs font-semibold text-slate-500 dark:text-slate-400 mb-4 gap-1.5">
           <svg class="w-4 h-4 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
           <time [attr.datetime]="event.eventDate">{{ event.eventDate | date:"dd/MM/yyyy 'às' HH:mm" }}</time>
        </div>

        <div class="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div class="flex flex-col">
            <span class="text-[10px] text-slate-400 uppercase tracking-widest font-bold">A partir de</span>
            <span class="text-xl font-black text-slate-900 dark:text-white" [attr.aria-label]="'Preço do ingresso: ' + event.price + ' reais'">R$ {{ event.price }},00</span>
          </div>
          
          <div class="flex items-center gap-3">
            <div *ngIf="event.availableTickets > 0" class="flex flex-col items-end text-right">
              <span class="text-[9px] uppercase font-black tracking-widest text-slate-400">Restam</span>
              <span class="text-sm font-black transition-colors duration-500" 
                    [ngClass]="event.availableTickets <= 10 ? 'text-rose-500 animate-pulse' : 'text-emerald-500'">
                {{ event.availableTickets }}
              </span>
            </div>

            <button (click)="addToCart()" 
                    [disabled]="event.availableTickets === 0 || event.isSoldOut"
                    [attr.aria-label]="event.availableTickets === 0 ? 'Ingressos esgotados para ' + event.name : 'Comprar ingresso para ' + event.name"
                    class="w-12 h-12 bg-rose-50 dark:bg-slate-800 text-rose-600 rounded-xl flex items-center justify-center hover:bg-rose-600 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed outline-none focus-visible:ring-4 focus-visible:ring-rose-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 group-hover:shadow-lg group-hover:shadow-rose-600/20 active:scale-95">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
            </button>
          </div>
        </div>
      </div>
    </article>
  `
})
export class EventCardComponent {
  @Input({ required: true }) event!: EventTicket;
  @Output() actionClick = new EventEmitter<EventTicket>(); // Mantido caso o ecrã pai precise

  private readonly cart = inject(CartStore);
  private readonly signalr = inject(SignalRService, { optional: true });
  private readonly cdr = inject(ChangeDetectorRef);

  constructor() {
    // 🔥 O Angular reage imediatamente a mensagens que chegam do WebSockets
    effect(() => {
      const update = this.signalr?.liveStockUpdates();
      if (update && update.eventId === this.event.id) {
        this.event.availableTickets = update.available;
        this.event.isSoldOut = update.available === 0;
        
        // 🚨 CRÍTICO: Avisa o Angular para repintar este Card específico (porque estamos a usar OnPush)
        this.cdr.markForCheck(); 
      }
    });
  }

  // Interação de Compra Centralizada
  addToCart() {
    this.cart.add(this.event);
    this.cart.openSidebar();
    this.actionClick.emit(this.event);
  }

  getImagem(category: string): string {
    const maps: Record<string, string> = {
      'Festas e Shows': 'photo-1459749411175-04bf5292ceea?q=80&w=800',
      'Teatros': 'photo-1507676184212-d0c30a51fb43?q=80&w=800',
      'Stand Up': 'photo-1585699324551-f6c309eedeca?q=80&w=800',
      'Esportes': 'photo-1540747913346-19e32dc3e97e?q=80&w=800',
      'Passeios': 'photo-1525164286253-04e68b9d9406?q=80&w=800'
    };
    return `https://images.unsplash.com/${maps[category] || 'photo-1540039155733-d7696d8ba620?q=80&w=800'}`;
  }
}