import {
  ChangeDetectionStrategy,
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
  imports: [CommonModule, EventCardComponent],
  template: `
    <section class="grid gap-6 md:grid-cols-2 lg:grid-cols-3 p-10">
      @for (event of store.events(); track event.id) {
      <app-event-card [event]="event" />
      }
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {
  private readonly service = inject(CatalogService);

  readonly store = inject(CatalogStore);

  ngOnInit(): void {
    this.store.setLoading(true);

    this.service.getEvents().subscribe({
      next: events => {
        this.store.setEvents(events);
        this.store.setLoading(false);
      },
      error: () => {
        this.store.setLoading(false);
      }
    });
  }
}