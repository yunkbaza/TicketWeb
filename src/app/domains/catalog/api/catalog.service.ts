import {
  Injectable
} from '@angular/core';

import { Observable }
from 'rxjs';

import { ApiClient }
from '../../../core/http/api-client.service';

import { EventTicket }
from '../models/event-ticket.model';

@Injectable({
  providedIn: 'root'
})
export class CatalogService {
  constructor(
    private readonly api:
      ApiClient
  ) {}

  getEvents(): Observable<EventTicket[]> {
    return this.api.get<EventTicket[]>('/api/catalog/events');
  }
}