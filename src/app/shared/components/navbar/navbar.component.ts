import { Component, EventEmitter, Output, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../../core/services/cart.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: './navbar.component.html'
})
export class NavbarComponent {
  auth = inject(AuthService);
  cart = inject(CartService);
  
  @Input() termoBusca = '';
  @Input() isDarkMode = false;
  
  @Output() termoBuscaChange = new EventEmitter<string>();
  @Output() toggleTheme = new EventEmitter<void>();
  @Output() openCart = new EventEmitter<void>();
  @Output() openLogin = new EventEmitter<'login' | 'register'>();
  @Output() resetSearch = new EventEmitter<void>();
}