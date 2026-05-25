export interface EventTicket {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  availableTickets: number;
  totalTickets: number;
  price: number;
  startsAt: string;
  location: string;
}