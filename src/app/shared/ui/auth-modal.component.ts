import { Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';
import { ToastService } from './toast/toast.service';
import { LanguageService } from '../../core/i18n/language.service';

@Component({
  selector: 'app-auth-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="fixed inset-0 z-[600] flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fade-in">
      <div class="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        <div class="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <h2 class="text-xl font-black text-slate-900 dark:text-white">
            {{ isLoginMode() ? 'Acesse sua Conta' : 'Crie sua Conta' }}
          </h2>
          <button (click)="close.emit()" class="text-slate-400 hover:text-rose-500 transition-colors">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div class="p-6">
          <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-4">
            
            <div *ngIf="!isLoginMode()">
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Nome Completo</label>
              <input formControlName="name" type="text" class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#780a43] text-slate-900 dark:text-white">
            </div>

            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">E-mail</label>
              <input formControlName="email" type="email" class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#780a43] text-slate-900 dark:text-white">
            </div>

            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Senha</label>
              <input formControlName="password" type="password" class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#780a43] text-slate-900 dark:text-white">
            </div>

            <button type="submit" [disabled]="form.invalid || isProcessing()" 
                    class="w-full mt-6 bg-[#780a43] text-white font-black py-4 rounded-xl hover:bg-[#600835] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2">
              <svg *ngIf="isProcessing()" class="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              {{ isProcessing() ? 'Aguarde...' : (isLoginMode() ? 'Entrar' : 'Registrar') }}
            </button>
          </form>

          <div class="mt-6 text-center">
            <button type="button" (click)="toggleMode()" class="text-sm font-bold text-slate-500 hover:text-[#780a43] transition-colors">
              {{ isLoginMode() ? 'Não tem conta? Registre-se.' : 'Já tem conta? Faça Login.' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AuthModalComponent {
  @Output() close = new EventEmitter<void>();
  
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly toast = inject(ToastService);
  
  public readonly isLoginMode = signal(true);
  public readonly isProcessing = signal(false);

  form: FormGroup = this.fb.group({
    name: [''], // Só exigido no registro
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  toggleMode() {
    this.isLoginMode.set(!this.isLoginMode());
    this.form.reset();
  }

  submit() {
    if (this.form.invalid) return;
    this.isProcessing.set(true);

    const data = this.form.value;
    const request = this.isLoginMode() 
      ? this.authService.login({ email: data.email, passwordHash: data.password })
      : this.authService.register({ name: data.name, email: data.email, passwordHash: data.password });

    request.subscribe({
      next: () => {
        this.toast.show(`Bem-vindo, ${this.authService.currentUser()?.name}!`);
        this.isProcessing.set(false);
        this.close.emit();
      },
      error: (err) => {
        this.toast.show(err.error?.message || 'Falha na autenticação. Verifique seus dados.');
        this.isProcessing.set(false);
      }
    });
  }
}