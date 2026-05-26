import { Injectable, signal, computed } from '@angular/core';

const TRANSLATIONS = {
  PT: {
    nav: {
      searchPlaceholder: 'Busque shows, teatros, festas...',
      loginBtn: 'Entrar',
      registerBtn: 'Criar Conta',
      logoutBtn: 'Sair'
    },
    home: {
      heroTag: 'Destaque da Semana',
      heroTitle: 'FESTIVAL AMORA SOUND 2026',
      heroSub: 'Sinta a vibração única do maior festival de música independente. Garanta seu lugar na pré-venda exclusiva antes que o lote acabe.',
      btnBuy: 'Garantir Ingresso',
      btnDetails: 'Conhecer Lineup',
      filterTitle: 'Navegue por Categorias',
      categories: {
        'Todos': 'Todos',
        'Festas e Shows': 'Festas e Shows',
        'Teatros': 'Teatros',
        'Stand Up': 'Stand Up',
        'Esportes': 'Esportes',
        'Passeios': 'Passeios'
      },
      emptyTitle: 'Nenhum evento localizado',
      emptySub: 'Não encontramos eventos para os filtros selecionados no momento.',
      emptyBtn: 'Redefinir Filtros'
    },
    footer: {
      desc: 'A plataforma definitiva para gerenciamento de ingressos de alta concorrência e experiências inesquecíveis.',
      colPlatform: 'Plataforma',
      colSupport: 'Suporte',
      colNewsletter: 'Fique por dentro',
      newsSub: 'Inscreva-se para receber pré-vendas e atualizações exclusivas de lotes.',
      rights: '© 2026 BazaTicket Engine. Todos os direitos reservados.'
    }
  },
  EN: {
    nav: {
      searchPlaceholder: 'Search events, concerts, theaters...',
      loginBtn: 'Sign In',
      registerBtn: 'Create Account',
      logoutBtn: 'Sign Out'
    },
    home: {
      heroTag: 'Featured Event',
      heroTitle: 'AMORA SOUND FESTIVAL 2026',
      heroSub: 'Feel the unique vibe of the largest independent music festival. Guarantee your pre-sale access before it sells out.',
      btnBuy: 'Get Tickets',
      btnDetails: 'View Lineup',
      filterTitle: 'Browse by Categories',
      categories: {
        'Todos': 'All',
        'Festas e Shows': 'Concerts & Parties',
        'Teatros': 'Theaters',
        'Stand Up': 'Stand Up Comedy',
        'Esportes': 'Sports',
        'Passeios': 'Tours & Trips'
      },
      emptyTitle: 'No events located',
      emptySub: 'We could not find any events matching your selected criteria at this time.',
      emptyBtn: 'Reset Filters'
    },
    footer: {
      desc: 'The ultimate platform for high-concurrency ticket management and unforgettable experiences.',
      colPlatform: 'Platform',
      colSupport: 'Support',
      colNewsletter: 'Stay Tuned',
      newsSub: 'Subscribe to get exclusive pre-sales and ticket tier updates.',
      rights: '© 2026 BazaTicket Engine. All rights reserved.'
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