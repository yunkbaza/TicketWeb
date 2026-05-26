import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  
  public isLoggedIn = signal<boolean>(!!localStorage.getItem('baza_jwt_token'));
  private readonly _isAuthenticated = signal(false);

  readonly isAuthenticated = this._isAuthenticated.asReadonly();

  login(token: string): void {
    localStorage.setItem('access_token', token);
    this._isAuthenticated.set(true);
  }

  logout(): void {
    localStorage.removeItem('access_token');
    this._isAuthenticated.set(false);
  }
}