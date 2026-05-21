import { Component } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  template: `
    <div class="flex items-center justify-center py-20">
      <div class="w-10 h-10 border-4 border-slate-300 border-t-rose-600 rounded-full animate-spin"></div>
    </div>
  `
})
export class LoadingSpinnerComponent {}