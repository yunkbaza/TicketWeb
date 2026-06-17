import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { NavbarComponent } from './navbar.component';
import { FooterComponent } from './footer.component';
import { ChatBotComponent } from '../shared/ui/chat-bot.component';
import { CartSidebarComponent } from '../domains/checkout/ui/cart-sidebar.component';
import { AuthModalComponent } from '../shared/ui/auth-modal.component';
import { AuthService } from '../core/auth/auth.service';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
    FooterComponent,
    ChatBotComponent,
    CartSidebarComponent,
    AuthModalComponent
  ],
  template: `
    <div class="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <app-navbar />

      <main class="flex-grow pt-20">
        <router-outlet />
      </main>

      <app-footer />
      <app-chat-bot />
      <app-cart-sidebar />
      
      <app-auth-modal 
        [isOpen]="auth.isAuthModalOpen()" 
        (closeModal)="auth.closeModal()">
      </app-auth-modal>
    </div>
  `
})
export class ShellComponent {
  // Injetamos o AuthService para o HTML conseguir ler e alterar o estado do Modal
  public auth = inject(AuthService);
}