import {
  Component,
  inject
} from '@angular/core';

import { RouterLink }
from '@angular/router';

import { CommonModule }
from '@angular/common';

import { LanguageService }
from '../core/i18n/language.service';

@Component({
  selector: 'app-navbar',

  standalone: true,

  imports: [
    CommonModule,
    RouterLink
  ],

  template: `
    <header
      class="border-b border-zinc-800 bg-zinc-950"
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

        <div
          class="flex items-center gap-4"
        >
          <button
            (click)="language.toggleLanguage()"
            class="bg-zinc-800 hover:bg-zinc-700 transition px-4 py-2 rounded-xl text-white"
          >
            {{
              language.currentLanguage() === 'pt'
                ? 'EN'
                : 'PT'
            }}
          </button>
        </div>
      </div>
    </header>
  `
})
export class NavbarComponent {
  readonly language =
    inject(LanguageService);
}