import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CatalogStore } from '../state/catalog.store';
import { CartStore } from '../../checkout/state/cart.store';
import { EventCardComponent } from '../ui/event-card.component';
import { AuthService } from '../../../core/auth/auth.service';
import { ToastService } from '../../../shared/ui/toast/toast.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, EventCardComponent],
  template: `
    <div class="w-full flex flex-col min-h-screen">
      <header class="relative w-full h-[55vh] md:h-[65vh] overflow-hidden bg-[url('https://images.unsplash.com/photo-1540039155733-d7696d8ba620?q=80&w=2500')] bg-cover bg-center" role="banner">
        <div class="absolute inset-0 bg-gradient-to-t from-slate-50 dark:from-slate-950 via-slate-950/60 to-transparent"></div>
        <div class="max-w-[1400px] mx-auto px-6 h-full flex flex-col justify-end pb-12 relative z-10">
          <div class="animate-fade-in-up max-w-3xl">
            <span class="py-1 px-3 bg-rose-600 rounded-full text-[10px] font-bold text-white mb-4 inline-block uppercase tracking-widest" aria-label="Evento em destaque">Destaque</span>
            <h1 class="text-4xl md:text-6xl font-black leading-tight text-white mb-4 tracking-tighter drop-shadow-xl">O MAIOR FESTIVAL DA SUA VIDA.</h1>
            <button aria-label="Ver detalhes do festival em destaque" class="py-3.5 px-8 bg-white text-slate-900 rounded-full font-bold shadow-lg hover:scale-105 active:scale-95 transition-all focus-visible:ring-4 focus-visible:ring-rose-500 outline-none text-sm">
              Ver Detalhes do Festival
            </button>
          </div>
        </div>
      </header>

      <nav aria-label="Filtro de categorias" class="max-w-[1400px] mx-auto w-full px-4 mt-8 mb-10">
        <div class="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x" role="tablist">
          <button *ngFor="let cat of categories" 
                  role="tab"
                  [attr.aria-selected]="catalog.category() === cat"
                  (click)="catalog.setCategory(cat)"
                  [ngClass]="catalog.category() === cat ? 'border-rose-600 bg-rose-50 dark:bg-rose-900/20 text-rose-600 ring-2 ring-rose-500/20' : 'bg-white dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'"
                  class="snap-start shrink-0 min-w-[120px] px-6 py-4 border rounded-2xl font-black text-xs uppercase tracking-wider transition-all outline-none focus-visible:ring-2 focus-visible:ring-rose-500">
            {{ cat }}
          </button>
        </div>
      </nav>

      <section class="max-w-[1400px] w-full mx-auto px-4 pb-20 flex-1" aria-label="Lista de Eventos">
        <h2 class="sr-only">Eventos Disponíveis</h2>
        
        <div *ngIf="catalog.loading()" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" aria-busy="true" aria-label="Carregando eventos">
          <div *ngFor="let i of [1,2,3,4,5,6,7,8]" class="animate-pulse bg-white dark:bg-slate-900 rounded-3xl h-[380px] border border-slate-100 dark:border-slate-800 flex flex-col p-4">
            <div class="w-full aspect-[4/3] bg-slate-200 dark:bg-slate-800 rounded-2xl mb-4"></div>
            <div class="h-6 bg-slate-200 dark:bg-slate-800 rounded-md w-3/4 mb-2"></div>
            <div class="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-1/2 mb-auto"></div>
            <div class="flex justify-between items-center mt-4">
              <div class="h-8 bg-slate-200 dark:bg-slate-800 rounded-md w-1/3"></div>
              <div class="h-10 w-10 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
            </div>
          </div>
        </div>

        <div *ngIf="!catalog.loading() && catalog.filteredEvents().length === 0" class="py-24 text-center bg-white dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center">
          <svg class="w-16 h-16 text-slate-300 dark:text-slate-700 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
          <h3 class="text-xl font-black text-slate-900 dark:text-white">Nenhum evento encontrado</h3>
          <p class="text-slate-500 mt-2">Tente ajustar seus filtros de busca ou categoria.</p>
          <button (click)="catalog.setSearchQuery(''); catalog.setCategory('Todos')" class="mt-6 text-rose-600 font-bold hover:text-rose-700 focus-visible:ring-2 focus-visible:ring-rose-500 rounded-lg outline-none px-4 py-2">
            Limpar todos os filtros
          </button>
        </div>

        <div *ngIf="!catalog.loading() && catalog.filteredEvents().length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <app-event-card 
            *ngFor="let ev of catalog.filteredEvents()" 
            [event]="ev" 
            (actionClick)="handleBuyClick($event)">
          </app-event-card>
        </div>
      </section>
    </div>
  `
})
export class HomeComponent implements OnInit {
  public catalog = inject(CatalogStore);
  public cart = inject(CartStore);
  private auth = inject(AuthService);
  private toast = inject(ToastService);

  public readonly categories = ['Todos', 'Festas e Shows', 'Teatros', 'Stand Up', 'Esportes', 'Passeios'];

  ngOnInit() {
    this.catalog.loadEvents();
  }

  handleBuyClick(event: any) {
    if (!this.auth.isLoggedIn()) {
      this.toast.show('Você precisa estar logado para comprar ingressos.');
      return;
    }
    this.cart.add(event);
  }
}