import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../core/i18n/language.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 pt-16 pb-8 transition-colors duration-300">
      <div class="max-w-[1600px] mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        
        <div>
          <h2 class="text-2xl font-black tracking-tighter text-slate-950 dark:text-white">
            BAZA<span class="text-[#780a43]">TICKET</span>
          </h2>
          <p class="text-sm text-slate-500 mt-4 leading-relaxed">
            {{ lang.t().footer.desc }}
          </p>
        </div>

        <div>
          <h4 class="font-black text-slate-900 dark:text-white uppercase text-xs tracking-widest mb-6">{{ lang.t().footer.colPlatform }}</h4>
          <ul class="space-y-4 text-sm text-slate-600 dark:text-slate-400 font-medium">
            <li><a href="#" class="hover:text-[#780a43] transition-colors">API Docs</a></li>
            <li><a href="#" class="hover:text-[#780a43] transition-colors">High-Concurrency Engine</a></li>
          </ul>
        </div>

        <div>
          <h4 class="font-black text-slate-900 dark:text-white uppercase text-xs tracking-widest mb-6">{{ lang.t().footer.colSupport }}</h4>
          <ul class="space-y-4 text-sm text-slate-600 dark:text-slate-400 font-medium">
            <li><a href="#" class="hover:text-[#780a43] transition-colors">Developer Portal</a></li>
            <li><a href="#" class="hover:text-[#780a43] transition-colors">SAGA Escalation Policy</a></li>
          </ul>
        </div>

        <div>
          <h4 class="font-black text-slate-900 dark:text-white uppercase text-xs tracking-widest mb-6">{{ lang.t().footer.colNewsletter }}</h4>
          <p class="text-xs text-slate-500 mb-4">{{ lang.t().footer.newsSub }}</p>
          <div class="flex">
            <input type="email" placeholder="dev@company.com" class="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-l-xl px-4 py-3 text-sm w-full outline-none focus:ring-2 focus:ring-[#780a43] text-slate-900 dark:text-white">
            <button class="bg-[#780a43] text-white px-4 rounded-r-xl font-bold hover:bg-[#600835] transition-all">OK</button>
          </div>
        </div>
      </div>

      <div class="max-w-[1600px] mx-auto px-6 pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] text-slate-400 font-bold uppercase tracking-wider">
        <p>{{ lang.t().footer.rights }}</p>
      </div>
    </footer>
  `
})
export class FooterComponent {
  protected readonly lang = inject(LanguageService);
}