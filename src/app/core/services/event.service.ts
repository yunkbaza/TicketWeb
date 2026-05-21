import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { EventTicket } from '../models/event-ticket.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/events`;

  getEvents(): Observable<EventTicket[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(events =>
        events.map(event => ({
          id: event.id,
          name: event.name,
          description: event.description,
          eventDate: event.eventDate,
          totalTickets: event.totalTickets,
          availableTickets: event.availableTickets,
          isSoldOut: event.isSoldOut,
          price: event.price ?? 0,
          category: event.category ?? 'Evento',
          imageUrl: event.imageUrl ??
            'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=1200&auto=format&fit=crop',

          bannerUrl: event.bannerUrl ??
            event.imageUrl ??
            'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=1800&auto=format&fit=crop',

          location: event.location ?? 'São Paulo - SP'
        }))
      )
    );
  }

  getEventById(id: string): Observable<EventTicket> {
    return this.http.get<EventTicket>(
      `${this.apiUrl}/${id}`
    );
  }
}