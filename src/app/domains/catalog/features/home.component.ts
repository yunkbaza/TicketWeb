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
    <div class="w-full flex flex-col min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      
      <header class="relative w-full h-[65vh] md:h-[75vh] flex items-end overflow-hidden" role="banner">
        <img src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2500" 
             alt="Headline Festival Cover" 
             class="absolute inset-0 w-full h-full object-cover object-center scale-105 animate-zoom-slow">
        
        <div class="absolute inset-0 bg-gradient-to-t from-white dark:from-slate-950 via-slate-950/50 to-transparent z-10"></div>
        
        <div class="relative z-20 max-w-[1600px] mx-auto w-full px-6 md:px-12 pb-16">
          <div class="max-w-3xl space-y-4">
            <span class="inline-flex items-center px-3 py-1 bg-[#780a43] text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
              {{ lang.t().home.heroTag }}
            </span>
            <h1 class="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none drop-shadow-2xl">
              {{ lang.t().home.heroTitle }}
            </h1>
            <p class="text-lg md:text-xl text-zinc-200 font-medium max-w-xl leading-relaxed drop-shadow-md">
              {{ lang.t().home.heroSub }}
            </p>
            <div class="flex flex-wrap gap-4 pt-4">
              <button class="bg-[#780a43] hover:bg-[#600835] text-white px-8 py-4 rounded-xl font-black text-sm transition-all active:scale-95 shadow-xl outline-none">
                {{ lang.t().home.btnBuy }}
              </button>
              <button class="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-xl font-black text-sm transition-all active:scale-95 outline-none">
                {{ lang.t().home.btnDetails }}
              </button>
            </div>
          </div>
        </div>
      </header>

      <nav class="max-w-[1600px] mx-auto w-full px-6 mt-12 mb-10">
        <h3 class="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">{{ lang.t().home.filterTitle }}</h3>
        <div class="flex gap-3 overflow-x-auto pb-4 scrollbar-hide snap-x">
          @for (cat of categories; track cat) {
            <button (click)="catalog.setCategory(cat)"
                    [ngClass]="catalog.category() === cat 
                      ? 'border-[#780a43] bg-[#780a43] text-white ring-4 ring-[#780a43]/10 shadow-lg shadow-[#780a43]/10' 
                      : 'bg-slate-50 dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'"
                    class="snap-start shrink-0 px-6 py-3.5 border rounded-2xl font-black text-xs uppercase tracking-wider transition-all outline-none">
              {{ getCategoryTranslation(cat) }}
            </button>
          }
        </div>
      </nav>

      <section class="max-w-[1600px] w-full mx-auto px-6 pb-24 flex-1">
        @if (catalog.loading()) {
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
            @for (i of [1,2,3,4]; track i) {
              <div class="bg-slate-100 dark:bg-slate-900 rounded-3xl h-[400px]"></div>
            }
          </div>
        } @else if (catalog.filteredEvents().length === 0) {
          <div class="py-24 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl mx-auto flex flex-col items-center">
            <h3 class="text-xl font-black text-slate-900 dark:text-white">{{ lang.t().home.emptyTitle }}</h3>
            <p class="text-slate-500 mt-2 text-sm">{{ lang.t().home.emptySub }}</p>
            <button (click)="catalog.setSearchQuery(''); catalog.setCategory('Todos')" class="mt-6 bg-[#780a43] text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider">
              {{ lang.t().home.emptyBtn }}
            </button>
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
  protected readonly lang = inject(LanguageService);
  private readonly auth = inject(AuthService);
  private readonly toast = inject(ToastService);

  protected readonly categories = ['Todos', 'Festas e Shows', 'Teatros', 'Stand Up', 'Esportes', 'Passeios'];

  ngOnInit() {
    this.catalog.loadEvents();
  }

  protected getCategoryTranslation(cat: string): string {
    const translations = this.lang.t().home.categories as Record<string, string>;
    return translations[cat] || cat;
  }

  protected handleBuyClick(event: any): void {
    if (!this.auth.isLoggedIn()) {
      this.toast.show(this.lang.currentLang() === 'PT' ? 'Faça login para continuar.' : 'Please sign in to proceed.');
      return;
    }
    this.cart.add(event);
  }
}