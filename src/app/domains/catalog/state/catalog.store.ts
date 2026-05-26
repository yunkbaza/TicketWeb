import { Injectable, signal, computed, inject } from '@angular/core';
import { ApiClient } from '../../../core/http/api-client.service';
import { EventTicket } from '../models/event-ticket.model';
import { finalize } from 'rxjs';

interface CatalogState {
  events: EventTicket[];
  loading: boolean;
  searchQuery: string;
  category: string;
}

@Injectable({ providedIn: 'root' })
export class CatalogStore {
  private readonly api = inject(ApiClient);

  private readonly state = signal<CatalogState>({
    events: [],
    loading: false,
    searchQuery: '',
    category: 'Todos'
  });

  public readonly events = computed(() => this.state().events);
  public readonly loading = computed(() => this.state().loading);
  public readonly searchQuery = computed(() => this.state().searchQuery);
  public readonly category = computed(() => this.state().category);

  public readonly filteredEvents = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const cat = this.category();
    return this.events().filter(e => {
      const matchCategory = cat === 'Todos' || e.category === cat;
      const matchSearch = e.name ? e.name.toLowerCase().includes(query) : false;
      return matchCategory && matchSearch;
    });
  });

  public setSearchQuery(query: string): void {
    this.state.update(s => ({ ...s, searchQuery: query }));
  }

  public setCategory(cat: string): void {
    this.state.update(s => ({ ...s, category: cat }));
  }

  public loadEvents(): void {
    if (this.events().length > 0) return; // Cache inteligente

    this.state.update(s => ({ ...s, loading: true }));
    
    this.api.get<EventTicket[]>('/api/catalog/events')
      .pipe(finalize(() => this.state.update(s => ({ ...s, loading: false }))))
      .subscribe({
        next: (events) => {
          // Fallback de design para preencher o que o backend ainda não manda
          const enrichedEvents = events.map((e, index) => ({
            ...e,
            price: e.price ?? Math.floor(Math.random() * 300) + 50,
            category: e.category ?? ['Festas e Shows', 'Teatros', 'Stand Up', 'Esportes', 'Passeios'][index % 5]
          }));
          this.state.update(s => ({ ...s, events: enrichedEvents }));
        },
        error: (err) => console.error('Erro ao carregar catálogo', err)
      });
  }
}