import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {

  public readonly isLoggedIn = signal<boolean>(localStorage.getItem('auth_token') === 'true');

  login(): void {
    localStorage.setItem('auth_token', 'true');
    this.isLoggedIn.set(true);
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    this.isLoggedIn.set(false);
  }
}