import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors, HttpInterceptorFn } from '@angular/common/http';
import { routes } from './app.routes';

// O "Segurança": Pega o token do navegador e injeta na requisição
const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('baza_jwt_token');
  
  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }
  
  return next(req);
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    // Registramos o interceptor globalmente aqui:
    provideHttpClient(withInterceptors([jwtInterceptor])) 
  ]
};