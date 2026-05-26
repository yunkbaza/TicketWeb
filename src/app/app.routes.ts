import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/shell.component').then(m => m.ShellComponent),
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
  { path: '**', redirectTo: '' }
];