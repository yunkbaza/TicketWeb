import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors, HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { routes } from './app.routes';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

// O "Segurança Inteligente": Pega o token, injeta, e se der 401, ele expulsa o usuário!
const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('baza_jwt_token');
  
  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }
  
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Se o Gateway rejeitar (Token expirado ou inválido)
        localStorage.removeItem('baza_jwt_token'); // Deleta o token velho
        alert('Sua sessão expirou por segurança. Por favor, faça o Login novamente!');
        window.location.reload(); // Recarrega a página para limpar o estado
      }
      return throwError(() => error);
    })
  );
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    // Registramos o interceptor globalmente
    provideHttpClient(withInterceptors([jwtInterceptor])) 
  ]
};