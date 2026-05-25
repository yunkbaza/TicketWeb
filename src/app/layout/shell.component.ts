import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { NavbarComponent } from './navbar.component';
import { FooterComponent } from './footer.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  template: `
    <app-navbar />

    <main>
      <router-outlet />
    </main>

    <app-footer />
  `
})
export class ShellComponent {}