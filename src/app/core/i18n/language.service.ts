import { Injectable, signal, computed } from '@angular/core';

const TRANSLATIONS = {
  PT: {
    home: {
      heroTag: 'Evento da Temporada',
      heroTitle: 'ROCK IN BAZA 2026',
      heroSub: 'A experiência sonora que você esperou o ano inteiro. Garanta seu ingresso antes que o lote esgote.',
      btnBuy: 'Comprar Agora',
      btnDetails: 'Ver Detalhes',
      filterAll: 'Todos',
      emptyTitle: 'Nenhum evento encontrado',
      emptySub: 'Tente ajustar seus filtros de busca ou categoria.',
      emptyBtn: 'Limpar filtros'
    }
  },
  EN: {
    home: {
      heroTag: 'Event of the Season',
      heroTitle: 'ROCK IN BAZA 2026',
      heroSub: 'The sound experience you have been waiting for all year. Get your tickets before they sell out.',
      btnBuy: 'Buy Now',
      btnDetails: 'See Details',
      filterAll: 'All',
      emptyTitle: 'No events found',
      emptySub: 'Try adjusting your search filters or category.',
      emptyBtn: 'Clear filters'
    }
  }
};

@Injectable({ providedIn: 'root' })
export class LanguageService {
  public readonly currentLang = signal<'PT' | 'EN'>((localStorage.getItem('lang') as 'PT' | 'EN') || 'PT');

  public readonly t = computed(() => TRANSLATIONS[this.currentLang()]);

  toggle(): void {
    const next = this.currentLang() === 'PT' ? 'EN' : 'PT';
    this.currentLang.set(next);
    localStorage.setItem('lang', next);
  }
}