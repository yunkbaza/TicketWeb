import { Injectable, signal, computed, inject } from '@angular/core';
import { CartItem } from '../models/cart-item.model';
import { EventTicket } from '../../catalog/models/event-ticket.model';
import { ToastService } from '../../../shared/ui/toast/toast.service';

@Injectable({ providedIn: 'root' })
export class CartStore {
  private readonly toast = inject(ToastService);
  
  // Estado privado: O único ponto de mutação da aplicação
  private readonly _items = signal<CartItem[]>([]);
  
  // Seletores Readonly: Componentes apenas leem, não alteram
  public readonly items = this._items.asReadonly();
  
  // Computados: Reagem automaticamente a mudanças no sinal de itens
  public readonly totalItems = computed(() => 
    this._items().reduce((acc, item) => acc + item.quantity, 0)
  );

  public readonly totalPrice = computed(() => 
    this._items().reduce((acc, item) => acc + ((item.event.price ?? 0) * item.quantity), 0)
  );

  /**
   * Adiciona um evento ao carrinho seguindo o padrão imutável.
   * O spread operator (...) garante que criamos um novo array, 
   * disparando a detecção de mudança do Angular.
   */
  public add(event: EventTicket): void {
    this._items.update((currentItems: CartItem[]) => {
      const existingItem = currentItems.find(i => i.event.id === event.id);
      
      if (existingItem) {
        // Regra de Negócio: Não ultrapassar o estoque disponível
        if (existingItem.quantity < event.availableTickets) {
          this.toast.show('Quantidade aumentada no carrinho.');
          return currentItems.map(item => 
            item.event.id === event.id 
              ? { ...item, quantity: item.quantity + 1 } 
              : item
          );
        } else {
          this.toast.show('Limite máximo de ingressos atingido.');
          return currentItems;
        }
      }
      
      // Criação de um novo CartItem respeitando a estrutura do seu modelo
      const newItem: CartItem = { event, quantity: 1 };
      this.toast.show(`${event.name} adicionado ao carrinho.`);
      return [...currentItems, newItem];
    });
  }

  public remove(eventId: string): void {
    this._items.update(items => items.filter(i => i.event.id !== eventId));
    this.toast.show('Item removido.');
  }

  public clear(): void {
    this._items.set([]);
  }
}