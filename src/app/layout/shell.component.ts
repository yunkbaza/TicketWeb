import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { NavbarComponent } from './navbar.component';
import { FooterComponent } from './footer.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
    FooterComponent
  ],
  template: `
    <div class="min-h-screen flex flex-col bg-zinc-950">
      <app-navbar />

      <main class="flex-1">
        <router-outlet />
      </main>

      <app-footer />
    </div>
  `
})
export class ShellComponent {}