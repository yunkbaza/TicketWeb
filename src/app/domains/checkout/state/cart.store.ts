import { Injectable, computed, signal } from '@angular/core';

import { CartItem } from '../models/cart-item.model';

@Injectable({
  providedIn: 'root'
})
export class CartStore {
  private readonly _items = signal<CartItem[]>([]);

  readonly items = this._items.asReadonly();

  readonly total = computed(() =>
    this._items().reduce((acc, item) => {
      return acc + item.price * item.quantity;
    }, 0)
  );

  addItem(item: CartItem): void {
    this._items.update(items => [...items, item]);
  }

  clear(): void {
    this._items.set([]);
  }
}