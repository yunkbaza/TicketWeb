import {
  Injectable
} from '@angular/core';

import { Observable }
from 'rxjs';

import { ApiClientService }
from '../../../core/http/api-client.service';

import { EventTicket }
from '../models/event-ticket.model';

@Injectable({
  providedIn: 'root'
})
export class CatalogService {
  constructor(
    private readonly api:
      ApiClientService
  ) {}

  getEvents():
    Observable<EventTicket[]> {
    return this.api.get<
      EventTicket[]
    >('/api/catalog/events');
  }
}