import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventService } from '../../../core/services/event.service';
import { CartService } from '../../../core/services/cart.service';
import { ToastService } from '../../../core/services/toast.service';

import { EventCardComponent } from '../../../shared/components/event-card/event-card.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

import { EventTicket } from '../../../core/models/event-ticket.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    EventCardComponent,
    LoadingSpinnerComponent
  ],
  templateUrl: './home.component.html'
})
export class HomeComponent {
  readonly events = signal<EventTicket[]>([]);
  readonly loading = signal(true);

  readonly filteredEvents = computed(() =>
    this.events()
  );

  constructor(
    private readonly eventService: EventService,
    private readonly cartService: CartService,
    private readonly toastService: ToastService
  ) {
    this.loadEvents();
  }

  loadEvents(): void {
    this.eventService.getEvents().subscribe({
      next: (events) => {
        this.events.set(events);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);

        this.toastService.show(
          'Erro ao carregar eventos.'
        );
      }
    });
  }

  addToCart(event: EventTicket): void {
    this.cartService.add(event);

    this.toastService.show(
      'Ingresso adicionado ao carrinho.'
    );
  }
}