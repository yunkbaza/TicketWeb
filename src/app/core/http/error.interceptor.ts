import {
  HttpErrorResponse,
  HttpInterceptorFn
} from '@angular/common/http';

import { inject } from '@angular/core';

import {
  catchError,
  throwError
} from 'rxjs';

import { ToastService }
from '../../shared/ui/toast/toast.service';

export const errorInterceptor:
  HttpInterceptorFn = (
    req,
    next
  ) => {
    const toast =
      inject(ToastService);

    return next(req).pipe(
      catchError(
        (error: HttpErrorResponse) => {
          console.error(
            '[HTTP ERROR]',
            error
          );

          switch (error.status) {
            case 0:
              toast.show(
                'Servidor indisponível'
              );
              break;

            case 400:
              toast.show(
                'Requisição inválida'
              );
              break;

            case 401:
              toast.show(
                'Não autorizado'
              );
              break;

            case 403:
              toast.show(
                'Acesso negado'
              );
              break;

            case 404:
              toast.show(
                'Recurso não encontrado'
              );
              break;

            case 500:
              toast.show(
                'Erro interno do servidor'
              );
              break;

            default:
              toast.show(
                'Erro inesperado'
              );
              break;
          }

          return throwError(
            () => error
          );
        }
      )
    );
  };