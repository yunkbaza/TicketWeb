import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from './toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3 rounded-xl shadow-2xl font-medium animate-fade-in-up flex items-center gap-3">
          {{ toast.message }}
        </div>
      }
    </div>
  `
})
export class ToastComponent {
  public toastService = inject(ToastService);
}