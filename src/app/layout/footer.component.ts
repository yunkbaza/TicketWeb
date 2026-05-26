import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 pt-16 pb-8">
      <div class="max-w-[1400px] mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        
        <div class="col-span-1">
          <a href="#" class="text-2xl font-black tracking-tighter text-slate-950 dark:text-white">
            BAZA<span class="text-rose-600">TICKET</span>
          </a>
          <p class="text-sm text-slate-500 mt-4 leading-relaxed">
            A engine de alta concorrência para eventos que transformam vidas.
          </p>
        </div>

        <div>
          <h4 class="font-black text-slate-900 dark:text-white uppercase text-xs tracking-widest mb-6">Plataforma</h4>
          <ul class="space-y-4 text-sm text-slate-600 dark:text-slate-400">
            <li><a href="#" class="hover:text-rose-600 transition-colors">Como funciona</a></li>
            <li><a href="#" class="hover:text-rose-600 transition-colors">Segurança</a></li>
            <li><a href="#" class="hover:text-rose-600 transition-colors">API para Organizadores</a></li>
          </ul>
        </div>

        <div>
          <h4 class="font-black text-slate-900 dark:text-white uppercase text-xs tracking-widest mb-6">Suporte</h4>
          <ul class="space-y-4 text-sm text-slate-600 dark:text-slate-400">
            <li><a href="#" class="hover:text-rose-600 transition-colors">Central de Ajuda</a></li>
            <li><a href="#" class="hover:text-rose-600 transition-colors">Políticas de Reembolso</a></li>
            <li><a href="#" class="hover:text-rose-600 transition-colors">Termos de Uso</a></li>
          </ul>
        </div>

        <div>
          <h4 class="font-black text-slate-900 dark:text-white uppercase text-xs tracking-widest mb-6">Fique por dentro</h4>
          <p class="text-xs text-slate-500 mb-4">Receba novidades dos melhores shows em primeira mão.</p>
          <div class="flex">
            <input type="email" placeholder="seu@email.com" class="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-l-xl px-4 py-3 text-sm w-full outline-none focus:ring-2 focus:ring-rose-500">
            <button class="bg-rose-600 text-white px-4 rounded-r-xl font-bold hover:bg-rose-700 transition-all">OK</button>
          </div>
        </div>
      </div>

      <div class="max-w-[1400px] mx-auto px-6 pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] text-slate-400 font-bold uppercase tracking-wider">
        <p>&copy; 2026 BazaTicket Engine. Todos os direitos reservados.</p>
        <div class="flex gap-6">
          <a href="#" class="hover:text-rose-600">Privacidade</a>
          <a href="#" class="hover:text-rose-600">Termos</a>
          <a href="#" class="hover:text-rose-600">Cookies</a>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {}