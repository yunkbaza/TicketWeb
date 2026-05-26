export interface EventTicket {
  id: string;
  name: string;
  eventDate: string;
  totalTickets: number;
  availableTickets: number;
  isSoldOut: boolean;
  price?: number; 
  category?: string;
  imageUrl?: string;
  description?: string;
}