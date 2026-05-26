import { Injectable, inject } from '@angular/core';
import { ApiClient } from '../../../core/http/api-client.service';
import { Observable } from 'rxjs';

// Interface que casa com o seu Record C# ReservationRequest
export interface ReservationPayload {
  eventId: string; 
  quantity: number;
}

export interface IntentResponse {
  clientSecret: string;
  orderId: string;
}

@Injectable({ providedIn: 'root' })
export class ReservationService {
  private readonly api = inject(ApiClient);

  // Método para criar o Payment Intent no Backend (SAGA Initiator)
  createIntent(payload: ReservationPayload): Observable<IntentResponse> {
    // A rota deve ser o que está configurado no seu Gateway (YARP)
    return this.api.post<IntentResponse, ReservationPayload>('/api/reservations/intent', payload);
  }

  // Método para reservar caso não use Intent
  reserveTicket(payload: ReservationPayload): Observable<any> {
    return this.api.post<any, ReservationPayload>('/api/reservations', payload);
  }
}