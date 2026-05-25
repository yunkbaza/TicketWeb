import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  readonly message = signal('');
  readonly visible = signal(false);

  show(message: string) {
    this.message.set(message);

    this.visible.set(true);

    setTimeout(() => {
      this.visible.set(false);
    }, 3000);
  }
}