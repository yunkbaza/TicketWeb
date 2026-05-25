import { Injectable } from '@angular/core';
import { loadStripe, Stripe } from '@stripe/stripe-js';

@Injectable({
  providedIn: 'root'
})
export class StripeService {
  private stripe: Stripe | null = null;

  async initialize(publicKey: string): Promise<void> {
    this.stripe = await loadStripe(publicKey);
  }

  async redirectToCheckout(sessionId: string): Promise<void> {
    if (!this.stripe) {
      throw new Error('Stripe not initialized');
    }

    await this.stripe.redirectToCheckout({
      sessionId
    });
  }
}