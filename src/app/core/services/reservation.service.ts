import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

import {
  ReservationRequest,
  ReservationResponse
} from '../models/reservation.model';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  constructor(
    private readonly http: HttpClient
  ) {}

  reserveTicket(
    payload: ReservationRequest
  ): Observable<ReservationResponse> {
    return this.http.post<ReservationResponse>(
      `${environment.apiUrl}/api/reservations`,
      payload
    );
  }
}