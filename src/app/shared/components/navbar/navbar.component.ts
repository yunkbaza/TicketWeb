import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ThemeService } from '../../../core/services/theme.service';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html'
})
export class NavbarComponent {
  readonly cartQuantity = computed(() =>
    this.cartService.quantity()
  );

  constructor(
    public readonly themeService: ThemeService,
    private readonly cartService: CartService
  ) {}

  toggleTheme(): void {
    this.themeService.toggle();
  }
}