export interface ReservationRequest {
  eventId: string;
  quantity: number;
}

export interface ReservationResponse {
  reservationId: string;
  status: string;
  totalAmount: number;
}