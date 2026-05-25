import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventTicket } from '../models/event-ticket.model';

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <article class="rounded-2xl border border-zinc-800 overflow-hidden bg-zinc-900">
      <img
        [src]="event.bannerUrl"
        [alt]="event.title"
        class="w-full h-56 object-cover"
      />

      <div class="p-5 flex flex-col gap-4">
        <div>
          <h2 class="text-xl font-bold text-white">
            {{ event.title }}
          </h2>

          <p class="text-zinc-400 text-sm mt-2">
            {{ event.description }}
          </p>
        </div>

        <div class="flex items-center justify-between">
          <span class="text-emerald-400 font-semibold">
            {{ event.price | currency:'BRL' }}
          </span>

          <button
            class="bg-white text-black px-4 py-2 rounded-xl font-medium"
          >
            Comprar
          </button>
        </div>
      </div>
    </article>
  `
})
export class EventCardComponent {
  @Input({ required: true })
  event!: EventTicket;
}