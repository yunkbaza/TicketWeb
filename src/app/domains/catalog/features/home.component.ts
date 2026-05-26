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
    <div class="w-full flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      
      <header class="relative w-full h-[55vh] md:h-[65vh] overflow-hidden bg-[url('https://images.unsplash.com/photo-1540039155733-d7696d8ba620?q=80&w=2500')] bg-cover bg-center" role="banner">
        <div class="absolute inset-0 bg-gradient-to-t from-slate-50 dark:from-slate-950 via-slate-950/60 to-transparent"></div>
        <div class="max-w-[1400px] mx-auto px-6 h-full flex flex-col justify-end pb-12 relative z-10">
          <div class="animate-fade-in-up max-w-3xl">
            <span class="py-1 px-3 bg-rose-600 rounded-full text-[10px] font-bold text-white mb-4 inline-block uppercase tracking-widest">Destaque</span>
            <h1 class="text-4xl md:text-6xl font-black leading-tight text-white mb-4 tracking-tighter drop-shadow-xl">O MAIOR FESTIVAL DA SUA VIDA.</h1>
            <button class="py-3.5 px-8 bg-white text-slate-900 rounded-full font-bold shadow-lg hover:scale-105 active:scale-95 transition-all outline-none text-sm">
              Ver Detalhes do Festival
            </button>
          </div>
        </div>
      </header>

      <nav aria-label="Filtro de categorias" class="max-w-[1400px] mx-auto w-full px-4 mt-8 mb-10">
        <div class="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x" role="tablist">
          @for (cat of categories; track cat) {
            <button role="tab"
                    [attr.aria-selected]="catalog.category() === cat"
                    (click)="catalog.setCategory(cat)"
                    [ngClass]="catalog.category() === cat ? 'border-rose-600 bg-rose-50 dark:bg-rose-900/20 text-rose-600 ring-2 ring-rose-500/20' : 'bg-white dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-slate-800'"
                    class="snap-start shrink-0 min-w-[120px] px-6 py-4 border rounded-2xl font-black text-xs uppercase tracking-wider transition-all outline-none">
              {{ cat }}
            </button>
          }
        </div>
      </nav>

      <section class="max-w-[1400px] w-full mx-auto px-4 pb-20 flex-1" aria-label="Lista de Eventos">
        
        @if (catalog.loading()) {
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" aria-busy="true">
            @for (i of [1,2,3,4,5,6,7,8]; track i) {
              <div class="animate-pulse bg-white dark:bg-slate-900 rounded-3xl h-[380px] border border-slate-100 dark:border-slate-800 p-4">
                <div class="w-full aspect-[4/3] bg-slate-200 dark:bg-slate-800 rounded-2xl mb-4"></div>
                <div class="h-6 bg-slate-200 dark:bg-slate-800 rounded-md w-3/4 mb-2"></div>
                <div class="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-1/2"></div>
              </div>
            }
          </div>
        } @else if (catalog.filteredEvents().length === 0) {
          <div class="py-24 text-center">
            <h3 class="text-xl font-black text-slate-900 dark:text-white">Nenhum evento encontrado</h3>
            <button (click)="catalog.setSearchQuery(''); catalog.setCategory('Todos')" class="mt-4 text-rose-600 font-bold underline">Limpar filtros</button>
          </div>
        } @else {
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            @for (ev of catalog.filteredEvents(); track ev.id) {
              <app-event-card 
                [event]="ev" 
                (actionClick)="handleBuyClick($event)">
              </app-event-card>
            }
          </div>
        }
      </section>
    </div>
  `
})
export class HomeComponent implements OnInit {
  protected readonly catalog = inject(CatalogStore);
  protected readonly cart = inject(CartStore);
  private readonly auth = inject(AuthService);
  private readonly toast = inject(ToastService);

  protected readonly categories = ['Todos', 'Festas e Shows', 'Teatros', 'Stand Up', 'Esportes', 'Passeios'];

  ngOnInit() {
    this.catalog.loadEvents();
  }

  protected handleBuyClick(event: any): void {
    // Garante o acesso via signal do AuthService
    if (!this.auth.isLoggedIn()) {
      this.toast.show('Você precisa estar logado para comprar ingressos.');
      return;
    }
    this.cart.add(event);
  }
}