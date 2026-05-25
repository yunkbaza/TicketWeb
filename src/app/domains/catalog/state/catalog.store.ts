import {
  Injectable,
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
    signal(false);

  readonly events =
    this._events.asReadonly();

  readonly loading =
    this._loading.asReadonly();

  setEvents(events: EventTicket[]) {
    this._events.set(events);
  }

  setLoading(value: boolean) {
    this._loading.set(value);
  }
}