import {
  Component,
  OnInit,
  computed,
  inject,
  signal
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { EventService } from './core/services/event.service';
import { AuthService } from './core/services/auth.service';
import { ReservationService } from './core/services/reservation.service';

import { EventTicket } from './core/models/event-ticket.model';
import { CartItem } from './core/models/cart-item.model';
import {
  LoginRequest,
  AuthResponse
} from './core/models/auth.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent implements OnInit {
  private readonly eventService =
    inject(EventService);

  private readonly authService =
    inject(AuthService);

  private readonly reservationService =
    inject(ReservationService);

  protected readonly events =
    signal<EventTicket[]>([]);

  protected readonly loading =
    signal<boolean>(true);

  protected readonly cart =
    signal<CartItem[]>([]);

  protected readonly search =
    signal<string>('');

  protected readonly category =
    signal<string>('Todos');

  protected readonly categories: string[] = [
    'Todos',
    'Festas e Shows',
    'Teatros',
    'Stand Up',
    'Esportes',
    'Passeios'
  ];

  protected readonly isDarkMode =
    signal<boolean>(false);

  protected readonly isCartOpen =
    signal<boolean>(false);

  protected readonly isLoginOpen =
    signal<boolean>(false);

  protected readonly isLogged =
    signal<boolean>(false);

  protected readonly email =
    signal<string>('');

  protected readonly password =
    signal<string>('');

  protected readonly toastMessage =
    signal<string>('');

  protected readonly filteredEvents =
    computed(() => {
      return this.events().filter(
        (event: EventTicket) => {
          const matchCategory =
            this.category() === 'Todos' ||
            event.category ===
              this.category();

          const matchSearch =
            event.name
              .toLowerCase()
              .includes(
                this.search().toLowerCase()
              );

          return (
            matchCategory && matchSearch
          );
        }
      );
    });

  protected readonly totalCartItems =
    computed(() => {
      return this.cart().reduce(
        (
          acc: number,
          item: CartItem
        ) => acc + item.quantity,
        0
      );
    });

  protected readonly totalCartPrice =
    computed(() => {
      return this.cart().reduce(
        (
          acc: number,
          item: CartItem
        ) =>
          acc +
          item.quantity *
            item.event.price,
        0
      );
    });

  ngOnInit(): void {
    this.loadEvents();
    this.restoreTheme();

    this.isLogged.set(
      !!localStorage.getItem(
        'baza_jwt_token'
      )
    );
  }

  protected loadEvents(): void {
    this.loading.set(true);

    this.eventService
      .getEvents()
      .subscribe({
        next: (
          events: EventTicket[]
        ) => {
          this.events.set(events);
          this.loading.set(false);
        },

        error: () => {
          this.showToast(
            'Erro ao carregar eventos.'
          );

          this.loading.set(false);
        }
      });
  }

  protected toggleTheme(): void {
    this.isDarkMode.update(
      (state: boolean) => !state
    );

    const isDark =
      this.isDarkMode();

    document.documentElement.classList.toggle(
      'dark',
      isDark
    );

    localStorage.setItem(
      'theme',
      isDark ? 'dark' : 'light'
    );
  }

  private restoreTheme(): void {
    const theme =
      localStorage.getItem('theme');

    if (theme === 'dark') {
      this.isDarkMode.set(true);

      document.documentElement.classList.add(
        'dark'
      );
    }
  }

  protected addToCart(
    event: EventTicket
  ): void {
    if (!this.isLogged()) {
      this.isLoginOpen.set(true);
      return;
    }

    const cart = [...this.cart()];

    const existingItem = cart.find(
      (
        item: CartItem
      ) => item.event.id === event.id
    );

    if (existingItem) {
      existingItem.quantity++;
    } else {
      cart.push({
        event,
        quantity: 1
      });
    }

    this.cart.set(cart);

    this.isCartOpen.set(true);

    this.showToast(
      `${event.name} adicionado ao carrinho`
    );
  }

  protected removeFromCart(
    id: string
  ): void {
    this.cart.set(
      this.cart().filter(
        (item: CartItem) =>
          item.event.id !== id
      )
    );
  }

  protected login(): void {
    if (
      !this.email() ||
      !this.password()
    ) {
      this.showToast(
        'Preencha e-mail e senha.'
      );

      return;
    }

    const payload: LoginRequest = {
      email: this.email(),
      password: this.password()
    };

    this.authService
      .login(payload)
      .subscribe({
        next: (
          response: AuthResponse
        ) => {
          localStorage.setItem(
            'baza_jwt_token',
            response.token
          );

          this.isLogged.set(true);

          this.isLoginOpen.set(false);

          this.showToast(
            'Login realizado com sucesso.'
          );
        },

        error: () => {
          this.showToast(
            'Credenciais inválidas.'
          );
        }
      });
  }

  protected checkout(): void {
    const firstItem =
      this.cart()[0];

    if (!firstItem) {
      return;
    }

    this.reservationService
      .reserveTicket({
        eventId:
          firstItem.event.id,
        quantity:
          firstItem.quantity
      })
      .subscribe({
        next: () => {
          this.showToast(
            'Compra realizada com sucesso.'
          );

          this.cart.set([]);

          this.isCartOpen.set(false);

          this.loadEvents();
        },

        error: () => {
          this.showToast(
            'Erro ao processar pagamento.'
          );
        }
      });
  }

  protected logout(): void {
    localStorage.removeItem(
      'baza_jwt_token'
    );

    this.isLogged.set(false);

    this.cart.set([]);

    this.showToast(
      'Sessão encerrada.'
    );
  }

  protected showToast(
    message: string
  ): void {
    this.toastMessage.set(message);

    setTimeout(() => {
      this.toastMessage.set('');
    }, 4000);
  }
}