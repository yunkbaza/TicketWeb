import {
  Injectable,
  computed,
  signal
} from '@angular/core';

import { CartItem } from '../models/cart-item.model';

@Injectable({
  providedIn: 'root'
})
export class CartStore {
  private readonly _items =
    signal<CartItem[]>([]);

  readonly items =
    this._items.asReadonly();

  readonly total = computed(() =>
    this._items().reduce(
      (acc, item) =>
        acc + item.price * item.quantity,
      0
    )
  );

  addItem(item: CartItem) {
    this._items.update(current => [
      ...current,
      item
    ]);
  }

  clear() {
    this._items.set([]);
  }
}