import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer
      class="border-t border-zinc-800 py-10 text-center text-zinc-500"
    >
      © 2026 BazaTicket — High Concurrency Ticketing Engine
    </footer>
  `
})
export class FooterComponent {}