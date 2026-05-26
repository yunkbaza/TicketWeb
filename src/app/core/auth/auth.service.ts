import { Injectable, signal, computed, inject } from '@angular/core';
import { ApiClient } from '../http/api-client.service';
import { AuthResponse, LoginRequest, RegisterRequest, User } from './auth.model';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(ApiClient);
  private readonly TOKEN_KEY = '@BazaTicket:Token';
  private readonly USER_KEY = '@BazaTicket:User';

  // O estado reativo real: lê do LocalStorage ao iniciar a aplicação
  private readonly currentUserSignal = signal<User | null>(this.loadUserFromStorage());
  
  // Computed property: se existe um usuário no sinal, ele está logado
  public readonly isLoggedIn = computed(() => this.currentUserSignal() !== null);
  public readonly currentUser = this.currentUserSignal.asReadonly();

  /**
   * Conecta com a API .NET para realizar o Login
   */
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.api.post<AuthResponse, LoginRequest>('/api/auth/login', credentials).pipe(
      tap(response => this.setAuthData(response))
    );
  }

  /**
   * Conecta com a API .NET para Criar Conta
   */
  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.api.post<AuthResponse, RegisterRequest>('/api/auth/register', data).pipe(
      tap(response => this.setAuthData(response))
    );
  }

  /**
   * Remove os dados e desconecta o usuário
   */
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSignal.set(null);
  }

  /**
   * Retorna o token para o Interceptor usar
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // --- MÉTODOS PRIVADOS DE INFRAESTRUTURA ---

  private setAuthData(response: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, response.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
    this.currentUserSignal.set(response.user);
  }

  private loadUserFromStorage(): User | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }
}