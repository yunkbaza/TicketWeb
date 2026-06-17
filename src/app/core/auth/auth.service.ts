import { Injectable, signal, computed, inject } from '@angular/core';
import { ApiClient } from '../http/api-client.service'; 
import { Observable, tap } from 'rxjs';

// O contrato exato do nosso backend C#
export interface User { id: string; name: string; email: string; }
export interface AuthResponse { token: string; user: User; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(ApiClient);
  
  // Nomes de chaves consistentes para o LocalStorage
  private readonly TOKEN_KEY = '@BazaTicket:Token';
  private readonly USER_KEY = '@BazaTicket:User';

  // ==========================================
  // 1. ESTADO DE DADOS (Usuário e Token)
  // ==========================================
  private readonly currentUserSignal = signal<User | null>(this.loadUserFromStorage());
  
  // Computed property (só é logado se houver usuário na memória)
  public readonly isLoggedIn = computed(() => this.currentUserSignal() !== null);
  public readonly currentUser = this.currentUserSignal.asReadonly();

  // ==========================================
  // 2. ESTADO DE UI (Controle do Modal de Login)
  // ==========================================
  public isAuthModalOpen = signal(false);

  public openModal() {
    this.isAuthModalOpen.set(true);
  }

  public closeModal() {
    this.isAuthModalOpen.set(false);
  }

  // Método auxiliar que a Navbar usa para saber se esconde o botão "Sign In"
  public isAuthenticated(): boolean {
    return this.isLoggedIn();
  }

  // ==========================================
  // 3. COMUNICAÇÃO COM O BACKEND C# (YARP)
  // ==========================================
  
  // Login chamando o YARP/IdentityService
  login(credentials: any): Observable<AuthResponse> {
    return this.api.post<AuthResponse, any>('/api/auth/login', credentials).pipe(
      tap(response => {
        this.setSession(response);
        this.closeModal(); 
      })
    );
  }

  // Registro chamando o YARP/IdentityService
  register(data: any): Observable<AuthResponse> {
    return this.api.post<AuthResponse, any>('/api/auth/register', data).pipe(
      tap(response => {
        this.setSession(response);
        this.closeModal(); 
      })
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