import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  template: `
    <header
      class="border-b border-zinc-800 bg-zinc-950 sticky top-0 z-50"
    >
      <div
        class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between"
      >
        <a
          routerLink="/"
          class="text-2xl font-bold text-white"
        >
          BazaTicket
        </a>

        <nav class="flex items-center gap-6">
          <a
            routerLink="/"
            class="text-zinc-300 hover:text-white"
          >
            Eventos
          </a>

          <a
            routerLink="/checkout"
            class="bg-white text-black px-4 py-2 rounded-xl font-medium"
          >
            Checkout
          </a>
        </nav>
      </div>
    </header>
  `
})
export class NavbarComponent {}