import {
  Component,
  Input
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { EventTicket } from '../models/event-ticket.model';

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <article
      class="bg-zinc-900 rounded-2xl overflow-hidden"
    >
      <img
        [src]="event.bannerUrl"
        [alt]="event.title"
        class="w-full h-60 object-cover"
      />

      <div class="p-5">
        <h2
          class="text-2xl font-bold"
        >
          {{ event.title }}
        </h2>

        <p class="text-zinc-400 mt-2">
          {{ event.location }}
        </p>

        <div
          class="flex items-center justify-between mt-6"
        >
          <span
            class="text-emerald-400 font-bold text-xl"
          >
            R$ {{ event.price }}
          </span>

          <button
            class="bg-white text-black px-4 py-2 rounded-xl"
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