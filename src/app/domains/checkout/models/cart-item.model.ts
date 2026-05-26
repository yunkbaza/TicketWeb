import { EventTicket } from '../../catalog/models/event-ticket.model';

export interface CartItem {
  event: EventTicket;
  quantity: number;
}