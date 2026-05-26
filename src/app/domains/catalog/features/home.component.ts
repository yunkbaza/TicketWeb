import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CatalogStore } from '../state/catalog.store';
import { CartStore } from '../../checkout/state/cart.store';
import { EventCardComponent } from '../ui/event-card.component';
import { AuthService } from '../../../core/auth/auth.service';
import { ToastService } from '../../../shared/ui/toast/toast.service';
import { LanguageService } from '../../../core/i18n/language.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, EventCardComponent],
  template: `
    <div class="w-full flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      
      <header class="relative w-full h-[65vh] md:h-[75vh] flex items-end overflow-hidden" role="banner">
        
        <img src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2500" 
             alt="Festival Destaque" 
             class="absolute inset-0 w-full h-full object-cover object-center scale-105 animate-zoom-slow">
        
        <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent z-10"></div>
        
        <div class="relative z-20 max-w-[1400px] mx-auto w-full px-6 md:px-12 pb-16">
          <div class="max-w-3xl space-y-4">
            <span class="inline-flex items-center px-3 py-1 bg-rose-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
              {{ lang.t().home.heroTag }}
            </span>
            <h1 class="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none drop-shadow-2xl">
              {{ lang.t().home.heroTitle }}
            </h1>
            <p class="text-lg md:text-xl text-zinc-200 font-medium max-w-xl leading-relaxed drop-shadow-md">
              {{ lang.t().home.heroSub }}
            </p>
            <div class="flex flex-wrap gap-4 pt-4">
              <button class="bg-white hover:bg-zinc-100 text-slate-950 px-8 py-4 rounded-xl font-black text-sm transition-all active:scale-95 shadow-xl outline-none focus-visible:ring-4 focus-visible:ring-rose-500">
                {{ lang.t().home.btnBuy }}
              </button>
              <button class="bg-transparent border border-white/30 hover:bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-black text-sm transition-all active:scale-95 outline-none">
                {{ lang.t().home.btnDetails }}
              </button>
            </div>
          </div>
        </div>
      </header>

      <nav class="max-w-[1400px] mx-auto w-full px-4 mt-8 mb-10">
        <div class="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
          @for (cat of categories; track cat) {
            <button (click)="catalog.setCategory(cat)"
                    [ngClass]="catalog.category() === cat ? 'border-rose-600 bg-rose-50 dark:bg-rose-900/20 text-rose-600 ring-2 ring-rose-500/20' : 'bg-white dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'"
                    class="snap-start shrink-0 min-w-[120px] px-6 py-4 border rounded-2xl font-black text-xs uppercase tracking-wider transition-all outline-none">
              {{ cat === 'Todos' ? lang.t().home.filterAll : cat }}
            </button>
          }
        </div>
      </nav>

      <section class="max-w-[1400px] w-full mx-auto px-4 pb-20 flex-1">
        @if (catalog.loading()) {
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            @for (i of [1,2,3,4]; track i) {
              <div class="animate-pulse bg-white dark:bg-slate-900 rounded-3xl h-[380px] border border-slate-100 dark:border-slate-800 p-4">
                <div class="w-full aspect-[4/3] bg-slate-200 dark:bg-slate-800 rounded-2xl mb-4"></div>
                <div class="h-6 bg-slate-200 dark:bg-slate-800 rounded-md w-3/4 mb-2"></div>
              </div>
            }
          </div>
        } @else if (catalog.filteredEvents().length === 0) {
          <div class="py-24 text-center">
            <h3 class="text-xl font-black text-slate-900 dark:text-white">{{ lang.t().home.emptyTitle }}</h3>
            <p class="text-slate-500 mt-2">{{ lang.t().home.emptySub }}</p>
            <button (click)="catalog.setSearchQuery(''); catalog.setCategory('Todos')" class="mt-4 text-rose-600 font-bold underline">{{ lang.t().home.emptyBtn }}</button>
          </div>
        } @else {
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            @for (ev of catalog.filteredEvents(); track ev.id) {
              <app-event-card [event]="ev" (actionClick)="handleBuyClick($event)"></app-event-card>
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
  protected readonly lang = inject(LanguageService); // <-- Injetado aqui para a UI ter acesso
  private readonly auth = inject(AuthService);
  private readonly toast = inject(ToastService);

  protected readonly categories = ['Todos', 'Festas e Shows', 'Teatros', 'Stand Up', 'Esportes', 'Passeios'];

  ngOnInit() {
    this.catalog.loadEvents();
  }

  protected handleBuyClick(event: any): void {
    if (!this.auth.isLoggedIn()) {
      this.toast.show(this.lang.currentLang() === 'PT' ? 'Faça login primeiro.' : 'Please login first.');
      return;
    }
    this.cart.add(event);
  }
}