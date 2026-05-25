import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import(
        './domains/catalog/features/home.component'
      ).then(m => m.HomeComponent)
  },
  {
    path: 'checkout',
    loadComponent: () =>
      import(
        './domains/checkout/features/checkout-flow.component'
      ).then(m => m.CheckoutFlowComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];