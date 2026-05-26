import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { NavbarComponent } from './navbar.component';
import { FooterComponent } from './footer.component';
import { ChatBotComponent } from '../shared/ui/chat-bot.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
    FooterComponent,
    ChatBotComponent
  ],
  template: `
    <div class="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <app-navbar />

      <main class="flex-1 w-full pt-20">
        <router-outlet />
      </main>

      <app-footer />
      <app-chat-bot />
    </div>
  `
})
export class ShellComponent {}