import { Injectable, signal, computed, inject } from '@angular/core';
import { ApiClient } from '../http/api-client.service';
import { Observable, tap } from 'rxjs';

// O contrato exato do nosso backend C#
export interface User { id: string; name: string; email: string; }
export interface AuthResponse { token: string; user: User; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(ApiClient);
  
  // Nomes de chaves consistentes
  private readonly TOKEN_KEY = '@BazaTicket:Token';
  private readonly USER_KEY = '@BazaTicket:User';

  // O estado reativo real
  private readonly currentUserSignal = signal<User | null>(this.loadUserFromStorage());
  
  // Computed property (só é logado se houver usuário na memória)
  public readonly isLoggedIn = computed(() => this.currentUserSignal() !== null);
  public readonly currentUser = this.currentUserSignal.asReadonly();

  // Login chamando o YARP/IdentityService
  login(credentials: any): Observable<AuthResponse> {
    return this.api.post<AuthResponse, any>('/api/auth/login', credentials).pipe(
      tap(response => this.setSession(response))
    );
  }

  // Registro chamando o YARP/IdentityService
  register(data: any): Observable<AuthResponse> {
    return this.api.post<AuthResponse, any>('/api/auth/register', data).pipe(
      tap(response => this.setSession(response))
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSignal.set(null);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private setSession(response: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, response.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
    this.currentUserSignal.set(response.user);
  }

  private loadUserFromStorage(): User | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }
}