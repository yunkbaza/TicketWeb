export interface EventTicket {
  id: string;

  name: string;

  description: string;

  location: string;

  category: string;

  eventDate: string;

  price: number;

  totalTickets: number;

  availableTickets: number;

  imageUrl: string;

  bannerUrl: string;

  isFeatured?: boolean;

  isSoldOut?: boolean;
}