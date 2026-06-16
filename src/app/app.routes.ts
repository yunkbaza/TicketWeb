import { Routes } from '@angular/router';
import { ShellComponent } from './layout/shell.component';

export const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./domains/catalog/features/home.component').then(m => m.HomeComponent)
      },
      {
        path: 'checkout/success',
        loadComponent: () => import('./domains/checkout/features/checkout-success.component').then(m => m.CheckoutSuccessComponent)
      },
      {
        path: 'checkout/cancel',
        loadComponent: () => import('./domains/checkout/features/checkout-cancel.component').then(m => m.CheckoutCancelComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];