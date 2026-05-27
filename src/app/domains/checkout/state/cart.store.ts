import { Injectable, signal, computed } from '@angular/core';
import { CartItem } from '../models/cart-item.model';
import { EventTicket } from '../../catalog/models/event-ticket.model';

interface CartState {
  items: CartItem[];
  isSidebarOpen: boolean;
}

@Injectable({ providedIn: 'root' })
export class CartStore {
  private readonly state = signal<CartState>({ items: [], isSidebarOpen: false });

  public readonly items = computed(() => this.state().items);
  public readonly isSidebarOpen = computed(() => this.state().isSidebarOpen);

  public readonly totalItems = computed(() => 
    this.items().reduce((acc, item) => acc + item.quantity, 0)
  );

  public readonly totalPrice = computed(() => 
    this.items().reduce((acc, item) => acc + (item.event.price ?? 0) * item.quantity, 0)
  );

  public add(event: EventTicket): void {
    this.state.update(s => {
      const existing = s.items.find(i => i.event.id === event.id);
      if (existing) {
        return { ...s, items: s.items.map(i => i.event.id === event.id ? { ...i, quantity: i.quantity + 1 } : i) };
      }
      return { ...s, items: [...s.items, { event, quantity: 1 }] };
    });
  }

  public clear(): void {
    this.state.update(s => ({ ...s, items: [] }));
  }

  // 🔥 Controles da Barra Lateral
  public openSidebar(): void {
    this.state.update(s => ({ ...s, isSidebarOpen: true }));
  }

  public closeSidebar(): void {
    this.state.update(s => ({ ...s, isSidebarOpen: false }));
  }
}