import { EventTicket } from './event-ticket.model';

export interface CartItem {
  event: EventTicket;
  quantity: number;
}