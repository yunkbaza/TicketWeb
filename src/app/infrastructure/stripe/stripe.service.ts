import { Injectable } from '@angular/core';

import {
  loadStripe
} from '@stripe/stripe-js';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StripeService {
  async checkout(sessionId: string) {
    const stripe = await loadStripe(
      environment.stripePublicKey
    );

    if (!stripe) {
      throw new Error(
        'Stripe initialization failed'
      );
    }

    const redirect =
      (stripe as any).redirectToCheckout;

    if (!redirect) {
      throw new Error(
        'redirectToCheckout unavailable'
      );
    }

    await redirect.call(stripe, {
      sessionId
    });
  }
}