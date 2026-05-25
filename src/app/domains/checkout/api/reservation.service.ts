import { inject, Injectable } from '@angular/core';

import { ApiClientService } from '../../../core/http/api-client.service';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private readonly api =
    inject(ApiClientService);

  reserveTickets(payload: unknown) {
    return this.api.post(
      '/api/reservations',
      payload
    );
  }
}