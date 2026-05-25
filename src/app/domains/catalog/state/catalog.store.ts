import {
  Injectable,
  computed,
  signal
} from '@angular/core';

import { EventTicket } from '../models/event-ticket.model';

@Injectable({
  providedIn: 'root'
})
export class CatalogStore {
  private readonly _events =
    signal<EventTicket[]>([]);

  private readonly _loading =
    signal<boolean>(false);

  readonly events =
    this._events.asReadonly();

  readonly loading =
    this._loading.asReadonly();

  readonly hasEvents = computed(
    () => this._events().length > 0
  );

  setEvents(events: EventTicket[]) {
    this._events.set(events);
  }

  addEvent(event: EventTicket) {
    this._events.update(current => [
      ...current,
      event
    ]);
  }

  setLoading(value: boolean) {
    this._loading.set(value);
  }

  clear() {
    this._events.set([]);
  }
}