import { EventTicket } from '../../catalog/models/event-ticket.model';

export interface CartItem {
  eventId: string;

  title: string;

  quantity: number;

  price: number;

  event: EventTicket;
}