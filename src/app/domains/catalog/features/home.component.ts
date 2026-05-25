import {
  Component,
  OnInit,
  inject
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { CatalogService } from '../api/catalog.service';

import { CatalogStore } from '../state/catalog.store';

import { EventCardComponent } from '../ui/event-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    EventCardComponent
  ],
  template: `
    <section
      class="max-w-7xl mx-auto px-6 py-10"
    >
      <h1
        class="text-4xl font-bold mb-10"
      >
        Eventos
      </h1>

      <div
        class="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        @for (
          event of store.events();
          track event.id
        ) {
          <app-event-card
            [event]="event"
          />
        }
      </div>
    </section>
  `
})
export class HomeComponent
  implements OnInit
{
  private readonly service =
    inject(CatalogService);

  readonly store =
    inject(CatalogStore);

  ngOnInit() {
    this.loadEvents();
  }

  private loadEvents() {
    this.store.setLoading(true);

    this.service.getEvents().subscribe({
      next: events => {
        this.store.setEvents(events);

        this.store.setLoading(false);
      },

      error: (error: any) => {
        console.error(error);

        this.store.setLoading(false);
      }
    });
  }
}