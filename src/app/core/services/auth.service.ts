import {
  Injectable,
  computed,
  signal
} from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { tap, Observable } from 'rxjs';

import { environment } from '../../environments/environment';

import {
  AuthResponse,
  LoginRequest
} from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY =
    'baza_jwt_token';

  private readonly _isAuthenticated =
    signal<boolean>(
      !!localStorage.getItem(
        this.TOKEN_KEY
      )
    );

  readonly isAuthenticated =
    computed(() =>
      this._isAuthenticated()
    );

  constructor(
    private readonly http: HttpClient
  ) {}

  login(
    payload: LoginRequest
  ): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(
        `${environment.apiUrl}/api/auth/login`,
        payload
      )
      .pipe(
        tap((response) => {
          localStorage.setItem(
            this.TOKEN_KEY,
            response.token
          );

          this._isAuthenticated.set(true);
        })
      );
  }

  logout(): void {
    localStorage.removeItem(
      this.TOKEN_KEY
    );

    this._isAuthenticated.set(false);
  }

  getToken(): string | null {
    return localStorage.getItem(
      this.TOKEN_KEY
    );
  }
}