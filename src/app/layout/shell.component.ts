import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { NavbarComponent } from './navbar.component';
import { FooterComponent } from './footer.component';
import { ChatBotComponent } from '../shared/ui/chat-bot.component';
import { CartSidebarComponent } from '../domains/checkout/ui/cart-sidebar.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
    FooterComponent,
    ChatBotComponent,
    CartSidebarComponent
  ],
  template: `
    <div class="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <app-navbar />

      <main>
        <router-outlet />
      </main>

      <app-footer />
      <app-chat-bot />
      <app-cart-sidebar />
    </div>
  `
})
export class ShellComponent {}