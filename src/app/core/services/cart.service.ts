
import { Injectable, computed, signal } from '@angular/core';

import { CartItem } from '../models/cart-item.model';
import { EventTicket } from '../models/event-ticket.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly _items = signal<CartItem[]>([]);

  readonly items = computed(() => this._items());

  readonly total = computed(() =>
    this._items().reduce(
      (acc, item) => acc + item.event.price * item.quantity,
      0
    )
  );

  readonly quantity = computed(() =>
    this._items().reduce((acc, item) => acc + item.quantity, 0)
  );

  add(event: EventTicket): void {
    const items = [...this._items()];

    const existingItem = items.find(
      (item) => item.event.id === event.id
    );

    if (existingItem) {
      existingItem.quantity++;
    } else {
      items.push({
        event,
        quantity: 1
      });
    }

    this._items.set(items);
  }

  remove(eventId: string): void {
    this._items.set(
      this._items().filter((item) => item.event.id !== eventId)
    );
  }

  clear(): void {
    this._items.set([]);
  }
}