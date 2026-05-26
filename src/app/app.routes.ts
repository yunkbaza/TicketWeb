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
        path: 'checkout',
        loadComponent: () => import('./domains/checkout/features/checkout-flow.component').then(m => m.CheckoutFlowComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];