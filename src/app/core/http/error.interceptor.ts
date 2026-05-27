import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../../shared/ui/toast/toast.service';
import { LanguageService } from '../i18n/language.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);
  const lang = inject(LanguageService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('[HTTP ERROR INTERCEPTOR]:', error);

      // Tenta extrair a mensagem enviada pelo Backend .NET (ex: result.BadRequest(new { message = "..." }))
      const serverMessage = error.error?.message;
      
      // Se o backend enviou uma mensagem, usamos ela; caso contrário, usamos a chave de tradução
      if (serverMessage) {
        toast.show(`❌ ${serverMessage}`);
      } else {
        toast.show(getLocalizedErrorMessage(error.status, lang));
      }

      return throwError(() => error);
    })
  );
};

// Mapeamento organizado por idioma para manter o sistema Master/Senior
function getLocalizedErrorMessage(status: number, lang: LanguageService): string {
  const isPT = lang.currentLang() === 'PT';
  
  const messages: Record<number, { pt: string; en: string }> = {
    0:   { pt: 'Servidor indisponível ou offline', en: 'Server unavailable or offline' },
    400: { pt: 'Requisição inválida enviada ao servidor', en: 'Invalid request sent to server' },
    401: { pt: 'Sua sessão expirou. Faça login novamente', en: 'Session expired. Please sign in' },
    403: { pt: 'Você não tem permissão para acessar este recurso', en: 'Access forbidden' },
    404: { pt: 'Recurso solicitado não encontrado', en: 'Resource not found' },
    500: { pt: 'Erro interno no servidor .NET', en: 'Internal server error' }
  };

  const error = messages[status] || { pt: 'Ocorreu um erro inesperado', en: 'An unexpected error occurred' };
  return isPT ? error.pt : error.en;
}