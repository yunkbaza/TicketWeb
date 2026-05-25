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
      return;
    }

    await (stripe as any)
      .redirectToCheckout({
        sessionId
      });
  }
}