import { Component, OnInit, inject, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface EventTicket {
  id: string;
  name: string;
  eventDate: string;
  totalTickets: number;
  availableTickets: number;
  isSoldOut: boolean;
  price?: number; 
  category?: string;
}

interface CartItem {
  event: EventTicket;
  quantity: number;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div [style.zoom]="fonteGrande ? '1.1' : '1'" 
         [ngClass]="altoContraste ? 'contrast-125 saturate-150 brightness-95' : ''"
         class="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-all duration-300 relative overflow-x-hidden pb-20">
      
      <nav class="fixed top-0 w-full z-[100] bg-white/95 dark:bg-slate-950/90 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-800/50 transition-all shadow-sm">
        <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 h-20 flex items-center justify-between gap-4">
          
          <div class="flex items-center gap-2.5 shrink-0 cursor-pointer group" (click)="termoBusca = ''; categoriaAtiva = 'Todos'">
            <div class="w-9 h-9 bg-rose-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform shadow-lg shadow-rose-600/20">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 text-white"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z" /></svg>
            </div>
            <h1 class="text-2xl font-black tracking-tighter text-slate-950 dark:text-white hidden sm:block">BAZA<span class="text-rose-600 dark:text-rose-500">TICKET</span></h1>
          </div>
          
          <div class="hidden md:flex flex-1 max-w-3xl items-center gap-2">
            <div class="flex items-center bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full px-5 py-2.5 w-full focus-within:ring-2 focus-within:ring-rose-500 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 text-slate-400 mr-2"><path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
              <input [(ngModel)]="termoBusca" type="text" placeholder="Busque shows, teatros, experiências..." class="bg-transparent border-none outline-none text-sm w-full text-slate-950 dark:text-white placeholder-slate-500">
            </div>
          </div>

          <div class="flex items-center gap-3 shrink-0">
            
            <button (click)="toggleTheme()" class="p-2 text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-500 transition-colors focus:outline-none rounded-full hover:bg-slate-100 dark:hover:bg-slate-800" [title]="isDarkMode ? 'Mudar para Modo Claro' : 'Mudar para Modo Escuro'">
              <svg *ngIf="isDarkMode" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" /></svg>
              <svg *ngIf="!isDarkMode" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" /></svg>
            </button>

            <button (click)="isCartOpen = true" class="relative p-2 text-slate-600 dark:text-slate-300 hover:text-rose-600 transition-colors focus:outline-none rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" /></svg>
              <span *ngIf="carrinho.length > 0" class="absolute top-0 right-0 w-4 h-4 bg-rose-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse">{{ getQuantidadeCarrinho() }}</span>
            </button>

            <ng-container *ngIf="!isLoggedIn">
              <button (click)="abrirModal('login')" class="text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-rose-600 hidden sm:block">Entrar</button>
              <button (click)="abrirModal('register')" class="bg-rose-600 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-rose-700 transition-all active:scale-95 shadow-sm">Criar Conta</button>
            </ng-container>

            <ng-container *ngIf="isLoggedIn">
              <span class="hidden lg:block text-sm font-bold text-slate-600 dark:text-slate-400">Olá, Vip</span>
              <div class="w-10 h-10 bg-gradient-to-tr from-rose-500 to-orange-400 rounded-full shadow-md flex items-center justify-center cursor-pointer relative group">
                <span class="text-white font-bold text-sm">V</span>
                <div class="absolute top-full right-0 mt-3 w-40 bg-white dark:bg-slate-900 rounded-xl shadow-xl p-2 border border-slate-100 dark:border-slate-800 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
                  <button (click)="mostrarAviso('Configurações de perfil em breve!')" class="w-full text-left p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-sm text-slate-700 dark:text-slate-300">Meu Perfil</button>
                  <button (click)="mostrarAviso('Página de Meus Ingressos sendo carregada...')" class="w-full text-left p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-sm text-slate-700 dark:text-slate-300">Meus Ingressos</button>
                  <div class="h-px bg-slate-100 dark:bg-slate-800 my-1"></div>
                  <button (click)="fazerLogout()" class="w-full text-left p-2 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-lg text-sm text-red-600 font-bold">Sair da Conta</button>
                </div>
              </div>
            </ng-container>
          </div>
        </div>
      </nav>

      <button (click)="isAcessibilidadeOpen = !isAcessibilidadeOpen" class="fixed top-24 left-0 z-40 bg-slate-900 dark:bg-rose-600 text-white p-2.5 rounded-r-xl shadow-xl hover:pr-4 transition-all group flex items-center outline-none">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 8.25a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 15.75v-1.5a2.25 2.25 0 0 1 2.25-2.25h3a2.25 2.25 0 0 1 2.25 2.25v1.5m-9 0h9m-9 0a2.25 2.25 0 0 0 2.25 2.25h4.5a2.25 2.25 0 0 0 2.25-2.25m-9 0V18m9-2.25V18" /><path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" /></svg>
      </button>

      <div *ngIf="isAcessibilidadeOpen" class="fixed top-24 left-14 z-[200] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl p-4 animate-fade-in w-64">
        <h4 class="text-sm font-black text-slate-900 dark:text-white mb-3">Acessibilidade</h4>
        
        <label class="flex items-center justify-between cursor-pointer mb-3 p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg">
          <span class="text-sm font-semibold text-slate-700 dark:text-slate-300">Alto Contraste</span>
          <input type="checkbox" [(ngModel)]="altoContraste" class="sr-only peer">
          <div class="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-600 relative"></div>
        </label>

        <label class="flex items-center justify-between cursor-pointer p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg">
          <span class="text-sm font-semibold text-slate-700 dark:text-slate-300">Fonte Maior</span>
          <input type="checkbox" [(ngModel)]="fonteGrande" class="sr-only peer">
          <div class="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-600 relative"></div>
        </label>
      </div>

      <header class="relative w-full h-[60vh] md:h-[70vh] pt-20 border-b border-slate-200 dark:border-slate-800/50 overflow-hidden">
        <div class="absolute inset-0 bg-cover bg-center transition-transform duration-1000" style="background-image: url('https://images.unsplash.com/photo-1540039155733-d7696d8ba620?q=80&w=2500&auto=format&fit=crop');">
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>
        </div>
        <div class="max-w-[1400px] mx-auto px-6 lg:px-8 h-full flex flex-col justify-end pb-12 relative z-10">
          <div class="max-w-3xl animate-fade-in-up">
            <span class="py-1 px-3 bg-rose-600 rounded-full text-[10px] font-bold text-white mb-3 max-w-fit uppercase tracking-widest">Destaque</span>
            <h2 class="text-4xl md:text-6xl font-black leading-tight text-white mb-3 tracking-tighter shadow-text">O MAIOR FESTIVAL DA SUA VIDA.</h2>
            <button (click)="mostrarAviso('Página de Detalhes do Evento será ativada na próxima versão!')" class="py-3 px-8 bg-white text-slate-900 rounded-full font-bold shadow-lg hover:scale-105 active:scale-95 transition-all text-sm w-fit flex items-center gap-2 mt-4">
              Ver Detalhes do Festival
            </button>
          </div>
        </div>
      </header>

      <section class="max-w-[1400px] mx-auto px-4 mt-12 mb-10">
        <div class="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x justify-start md:justify-center">
          <button *ngFor="let cat of categoriasLista" 
                  (click)="categoriaAtiva = cat"
                  [ngClass]="categoriaAtiva === cat ? 'border-rose-600 ring-2 ring-rose-500/20 bg-rose-50 dark:bg-rose-950/20' : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-rose-400'"
                  class="snap-start shrink-0 flex flex-col items-center gap-2 w-28 p-4 border rounded-2xl transition-all outline-none">
            <span [ngClass]="categoriaAtiva === cat ? 'text-rose-600' : 'text-slate-500'" class="text-2xl">{{ getIconeCategoria(cat) }}</span>
            <span [ngClass]="categoriaAtiva === cat ? 'text-rose-600' : 'text-slate-700 dark:text-slate-300'" class="text-[11px] font-bold text-center tracking-tight">{{ cat }}</span>
          </button>
        </div>
      </section>

      <main class="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-16 min-h-[40vh]">
        <div class="flex justify-between items-end mb-8 border-b border-slate-200 dark:border-slate-800/50 pb-4">
          <h3 class="text-2xl font-black uppercase tracking-tighter text-slate-950 dark:text-white">
            {{ categoriaAtiva === 'Todos' ? 'Todos os Eventos' : categoriaAtiva }}
          </h3>
        </div>

        <div *ngIf="isLoading" class="py-20 text-center flex flex-col items-center justify-center">
          <div class="w-10 h-10 border-4 border-slate-200 dark:border-slate-800 border-t-rose-600 rounded-full animate-spin mb-4"></div>
          <p class="text-slate-500 font-semibold text-sm">Carregando experiências incríveis...</p>
        </div>

        <div *ngIf="!isLoading && eventosFiltrados.length === 0" class="py-20 text-center bg-white dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
          <span class="text-4xl mb-4 block">😢</span>
          <h4 class="text-lg font-bold text-slate-700 dark:text-slate-300">Nenhum evento encontrado</h4>
          <p class="text-slate-500 text-sm mt-1">Tente mudar os filtros ou a sua busca.</p>
          <button (click)="termoBusca = ''; categoriaAtiva = 'Todos'" class="mt-4 text-rose-600 font-bold text-sm hover:underline outline-none">Limpar Filtros</button>
        </div>

        <div *ngIf="!isLoading && eventosFiltrados.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <article *ngFor="let event of eventosFiltrados" class="group flex flex-col bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:shadow-xl dark:hover:shadow-rose-900/10 transition-all duration-300">
            
            <div class="relative w-full aspect-[4/3] bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div class="absolute inset-0 bg-gradient-to-tr from-rose-950/40 to-transparent z-10"></div>
              <div class="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=800&auto=format&fit=crop')] bg-cover bg-center group-hover:scale-110 transition-transform duration-700"></div>
              <div class="absolute top-3 right-3 z-20 bg-black/50 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-md">{{ event.category }}</div>
              
              <div *ngIf="event.isSoldOut" class="absolute inset-0 bg-black/60 backdrop-blur-sm z-20 flex items-center justify-center">
                <span class="bg-red-600 text-white font-black px-6 py-2 rounded-xl text-lg uppercase tracking-widest shadow-2xl rotate-[-10deg] border-2 border-dashed border-white">Esgotado</span>
              </div>
            </div>

            <div class="p-5 flex-1 flex flex-col">
              <h4 class="text-lg font-black text-slate-950 dark:text-white leading-tight mb-1 line-clamp-2">{{ event.name }}</h4>
              <p class="text-sm font-semibold text-rose-600 dark:text-rose-500 mb-4">{{ event.eventDate | date:"dd/MM/yyyy 'às' HH:mm" }}</p>

              <div class="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span class="block text-[10px] text-slate-500 uppercase tracking-wider font-bold">A partir de</span>
                  <span class="text-lg font-black text-slate-900 dark:text-white">R$ {{ event.price }},00</span>
                </div>
                
                <button (click)="adicionarAoCarrinho(event)" [disabled]="event.isSoldOut" class="w-10 h-10 bg-rose-50 dark:bg-slate-800 hover:bg-rose-600 hover:text-white text-rose-600 rounded-xl flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed outline-none">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                </button>
              </div>
            </div>
          </article>
        </div>
      </main>

      <footer class="bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pt-16 pb-8">
        <div class="max-w-[1400px] mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div class="col-span-1 md:col-span-1">
            <h2 class="text-2xl font-black tracking-tighter text-slate-950 dark:text-white mb-4">BAZA<span class="text-rose-600">TICKET</span></h2>
            <p class="text-sm text-slate-500 mb-6">A maneira mais rápida e segura de garantir o seu lugar nas melhores experiências do Brasil.</p>
          </div>
          <div>
            <h4 class="font-bold text-slate-900 dark:text-white mb-4">Para Fãs</h4>
            <ul class="space-y-2 text-sm text-slate-500">
              <li><a href="#" (click)="$event.preventDefault(); mostrarAviso('Acesse seu perfil de usuário!')" class="hover:text-rose-600 transition-colors">Meus Ingressos</a></li>
              <li><a href="#" (click)="$event.preventDefault(); mostrarAviso('Nossa central de ajuda por e-mail está chegando.')" class="hover:text-rose-600 transition-colors">Central de Ajuda</a></li>
              <li><a href="#" (click)="$event.preventDefault(); mostrarAviso('Aceitamos Pix e Cartão de Crédito.')" class="hover:text-rose-600 transition-colors">Meios de Pagamento</a></li>
            </ul>
          </div>
          <div>
            <h4 class="font-bold text-slate-900 dark:text-white mb-4">Institucional</h4>
            <ul class="space-y-2 text-sm text-slate-500">
              <li><a href="#" (click)="$event.preventDefault(); mostrarAviso('Em breve, página sobre nós.')" class="hover:text-rose-600 transition-colors">Sobre a Empresa</a></li>
              <li><a href="#" (click)="$event.preventDefault(); mostrarAviso('Seja um produtor parceiro!')" class="hover:text-rose-600 transition-colors">Venda na BazaTicket</a></li>
            </ul>
          </div>
          <div>
            <h4 class="font-bold text-slate-900 dark:text-white mb-4">Segurança</h4>
            <div class="flex gap-2 flex-wrap text-2xl">
              🔒 💳 🎫 📱
            </div>
            <p class="text-xs text-slate-500 mt-3">Pagamentos processados com criptografia de ponta a ponta.</p>
          </div>
        </div>
        <div class="max-w-[1400px] mx-auto px-6 border-t border-slate-200 dark:border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
          <p>© 2026 BazaTicket Experiências. Todos os direitos reservados.</p>
          <div class="flex gap-4 mt-4 md:mt-0">
            <a href="#" class="hover:text-slate-900 dark:hover:text-white">Termos de Uso</a>
            <a href="#" class="hover:text-slate-900 dark:hover:text-white">Privacidade</a>
          </div>
        </div>
      </footer>

      <div *ngIf="isCartOpen" class="fixed inset-0 z-[300] bg-slate-950/50 backdrop-blur-sm flex justify-end animate-fade-in">
        <div class="w-full max-w-md bg-white dark:bg-slate-950 h-full shadow-2xl flex flex-col animate-slide-left border-l border-slate-200 dark:border-slate-800">
          
          <div class="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900">
            <h2 class="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">🛒 Seus Ingressos</h2>
            <button (click)="isCartOpen = false" class="p-2 text-slate-400 hover:text-red-500 bg-white dark:bg-slate-800 rounded-full shadow-sm outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div class="flex-1 overflow-y-auto p-6">
            <div *ngIf="carrinho.length === 0" class="h-full flex flex-col items-center justify-center text-center">
              <div class="text-5xl mb-4 opacity-50">🎫</div>
              <p class="text-slate-500 font-medium text-lg">Seu carrinho está vazio.</p>
              <button (click)="isCartOpen = false" class="mt-4 text-rose-600 font-bold hover:underline outline-none">Continuar explorando</button>
            </div>

            <div *ngFor="let item of carrinho" class="flex gap-4 mb-4 bg-slate-50 dark:bg-slate-900 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 relative group">
              <div class="w-20 h-20 bg-slate-200 dark:bg-slate-800 rounded-xl bg-[url('https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=200&auto=format&fit=crop')] bg-cover bg-center"></div>
              <div class="flex-1 py-1">
                <h5 class="text-sm font-bold text-slate-900 dark:text-white leading-tight pr-6">{{ item.event.name }}</h5>
                <p class="text-xs text-slate-500 mt-1">{{ item.event.eventDate | date:"dd/MM/yyyy" }}</p>
                <div class="flex justify-between items-center mt-2">
                  <p class="text-sm font-black text-rose-600">R$ {{ item.event.price }},00</p>
                  <span class="text-xs font-bold text-slate-500 bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded">Qtd: {{ item.quantity }}</span>
                </div>
              </div>
              <button (click)="removerDoCarrinho(item.event.id)" class="absolute top-2 right-2 text-slate-300 hover:text-red-500 p-1 bg-white dark:bg-slate-950 rounded-md shadow outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
              </button>
            </div>
          </div>

          <div *ngIf="carrinho.length > 0" class="p-6 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950">
            <div class="flex justify-between items-center mb-6">
              <span class="text-slate-500 font-semibold">Total a pagar:</span>
              <span class="text-2xl font-black text-slate-900 dark:text-white">R$ {{ getTotalCarrinho() }},00</span>
            </div>
            
            <button (click)="finalizarCompra()" [disabled]="isProcessing" class="w-full bg-rose-600 text-white font-black py-4 rounded-xl hover:bg-rose-700 transition-all active:scale-95 shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 outline-none">
              <span *ngIf="isProcessing" class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              {{ isProcessing ? 'Processando Pagamento...' : 'Finalizar Compra Segura' }}
            </button>
          </div>
        </div>
      </div>

      <div *ngIf="isLoginOpen" class="fixed inset-0 z-[400] flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-fade-in">
        <div class="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 relative animate-fade-in-up">
          <button (click)="isLoginOpen = false" class="absolute top-6 right-6 text-slate-400 hover:text-red-500 transition-colors z-10 p-1 bg-slate-100 dark:bg-slate-800 rounded-md outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
          </button>
          
          <div class="p-8 pb-4 text-center border-b border-slate-100 dark:border-slate-800 relative">
            <div class="w-14 h-14 bg-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-rose-600/20"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-white"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z" /></svg></div>
            <h2 class="text-2xl font-black tracking-tight text-slate-950 dark:text-white">
              {{ modalMode === 'login' ? 'Acesse sua conta' : 'Crie sua conta VIP' }}
            </h2>
          </div>
          
          <div class="p-8 space-y-4">
            <div *ngIf="modalMode === 'register'">
              <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nome Completo</label>
              <input type="text" placeholder="Seu Nome" class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-950 dark:text-white focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500">
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">E-mail</label>
              <input [(ngModel)]="email" type="email" placeholder="admin@baza.com" class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-950 dark:text-white focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500">
            </div>
            
            <div>
              <div class="flex justify-between items-center mb-2">
                <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider">Senha</label>
              </div>
              <input [(ngModel)]="password" type="password" placeholder="••••••••" class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-950 dark:text-white focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500">
            </div>
            
            <button (click)="autenticar()" class="w-full bg-rose-600 text-white font-black py-3.5 rounded-xl hover:bg-rose-700 transition-all active:scale-95 shadow-lg shadow-rose-600/20 mt-2 text-sm outline-none">
              {{ modalMode === 'login' ? 'Entrar' : 'Criar Conta e Entrar' }}
            </button>

            <p class="text-center text-sm font-medium text-slate-500 pt-2">
              {{ modalMode === 'login' ? 'Ainda não tem conta?' : 'Já possui uma conta?' }} 
              <button (click)="modalMode = modalMode === 'login' ? 'register' : 'login'" class="text-rose-600 font-bold hover:underline ml-1 outline-none">
                {{ modalMode === 'login' ? 'Criar agora' : 'Faça login' }}
              </button>
            </p>
          </div>
        </div>
      </div>

      <div *ngIf="isChatOpen" class="fixed bottom-24 right-4 md:right-8 z-[150] w-[90vw] md:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl flex flex-col animate-fade-in-up">
        
        <div class="bg-rose-600 p-4 flex justify-between items-center text-white rounded-t-3xl">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-xl shadow-inner border border-white/20">👩‍💼</div>
            <div>
              <h4 class="font-black text-sm leading-tight tracking-tight">Atendimento Baza</h4>
              <span class="text-[10px] font-bold text-rose-200 flex items-center gap-1">
                <span class="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span> Online
              </span>
            </div>
          </div>
          <button (click)="isChatOpen = false" class="text-rose-200 hover:text-white transition-colors p-1 bg-black/10 rounded-md outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div #chatScroll class="h-80 max-h-[60vh] p-4 overflow-y-auto bg-slate-50 dark:bg-slate-950 flex flex-col gap-4">
          <div *ngFor="let msg of mensagensChat" [ngClass]="msg.bot ? 'items-start' : 'items-end'" class="flex flex-col w-full">
            <div [ngClass]="msg.bot ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-br-2xl border border-slate-200 dark:border-slate-700' : 'bg-rose-600 text-white rounded-bl-2xl shadow-sm'" class="p-3.5 rounded-t-2xl max-w-[85%] text-sm font-medium leading-relaxed">
              {{ msg.texto }}
            </div>
            <span class="text-[10px] text-slate-400 font-semibold mt-1 px-1">{{ msg.bot ? 'Assistente Baza' : 'Você' }}</span>
          </div>
          
          <div *ngIf="chatDigitando" class="flex items-start w-full animate-pulse">
            <div class="bg-white dark:bg-slate-800 p-3 rounded-2xl rounded-bl-none border border-slate-200 dark:border-slate-700 flex gap-1.5 items-center">
              <span class="w-1.5 h-1.5 bg-slate-400 rounded-full"></span><span class="w-1.5 h-1.5 bg-slate-400 rounded-full"></span><span class="w-1.5 h-1.5 bg-slate-400 rounded-full"></span>
            </div>
          </div>
        </div>

        <div class="p-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 rounded-b-3xl">
          <input [(ngModel)]="chatInput" (keyup.enter)="enviarMensagemChat()" type="text" placeholder="Dúvidas sobre pagamento ou ingressos?" class="flex-1 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-rose-500 transition-all">
          <button (click)="enviarMensagemChat()" [disabled]="!chatInput.trim() || chatDigitando" class="w-12 h-12 shrink-0 bg-rose-600 text-white rounded-xl flex items-center justify-center hover:bg-rose-700 disabled:opacity-50 outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 -ml-0.5"><path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" /></svg>
          </button>
        </div>
      </div>

      <button (click)="isChatOpen = !isChatOpen" class="fixed bottom-6 right-4 md:bottom-8 md:right-8 z-50 bg-slate-900 dark:bg-white text-white dark:text-slate-950 p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center group outline-none ring-4 ring-slate-900/20 dark:ring-white/20">
        <svg *ngIf="!isChatOpen" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-7 h-7"><path stroke-linecap="round" stroke-linejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" /></svg>
        <svg *ngIf="isChatOpen" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-7 h-7"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
      </button>

      <div *ngIf="toastMessage" class="fixed top-24 right-1/2 translate-x-1/2 md:translate-x-0 md:right-8 z-[500] bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-fade-in-up border border-slate-700 w-[90%] md:w-auto">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6 text-rose-500 shrink-0"><path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" /></svg>
        <p class="text-sm font-semibold leading-tight">{{ toastMessage }}</p>
      </div>

    </div>
  `,
  styles: [`
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideLeft { from { transform: translateX(100%); } to { transform: translateX(0); } }
    .animate-fade-in-up { animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .animate-fade-in { animation: fadeIn 0.2s ease-out forwards; }
    .animate-slide-left { animation: slideLeft 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .shadow-text { text-shadow: 0 4px 10px rgba(0,0,0,0.5); }
    .scrollbar-hide::-webkit-scrollbar { display: none; }
    .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
  `]
})
export class AppComponent implements OnInit, AfterViewChecked {
  private http = inject(HttpClient);
  @ViewChild('chatScroll') private chatScrollContainer!: ElementRef;
  
  eventos: EventTicket[] = [];
  isLoading = true;
  isLoggedIn = false;
  
  // TEMA MODO CLARO/ESCURO
  isDarkMode = false; 

  // Acessibilidade (A11y)
  isAcessibilidadeOpen = false;
  altoContraste = false;
  fonteGrande = false;

  termoBusca = '';
  categoriaAtiva = 'Todos';
  categoriasLista = ['Todos', 'Festas e Shows', 'Teatros', 'Stand Up', 'Esportes', 'Passeios'];
  
  carrinho: CartItem[] = [];
  isCartOpen = false;
  isProcessing = false;
  
  isLoginOpen = false;
  modalMode: 'login' | 'register' = 'login';
  email = '';
  password = '';

  isChatOpen = false;
  chatDigitando = false;
  chatInput = '';
  mensagensChat = [{ bot: true, texto: 'Olá! Sou a assistente de atendimento da BazaTicket. Como posso te ajudar com a sua compra de ingressos hoje? 😊' }];
  toastMessage = '';
  toastTimeout: any;

  ngOnInit() {
    this.verificarSessao();
    this.carregarEventos();
    
    // Inicia no Modo Claro por padrão (conforme solicitado), mas verifica se já havia uma escolha salva
    if (localStorage.getItem('theme') === 'dark') {
      this.isDarkMode = true;
      document.documentElement.classList.add('dark');
    } else {
      this.isDarkMode = false;
      document.documentElement.classList.remove('dark');
    }
  }

  // Alterna as classes do Tailwind no root document
  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      if(this.chatScrollContainer) {
        this.chatScrollContainer.nativeElement.scrollTop = this.chatScrollContainer.nativeElement.scrollHeight;
      }
    } catch(err) { }
  }

  carregarEventos() {
    this.isLoading = true;
    this.http.get<EventTicket[]>('http://localhost:5130/api/events').subscribe({
      next: (dados) => {
        const categoriasMock = ['Festas e Shows', 'Teatros', 'Stand Up', 'Esportes'];
        this.eventos = dados.map((ev, index) => ({
          ...ev,
          price: Math.floor(Math.random() * (350 - 50 + 1) + 50), 
          category: categoriasMock[index % categoriasMock.length]
        }));
        this.isLoading = false;
      },
      error: () => {
        this.mostrarAviso('Puxa, estamos com instabilidade na conexão com os servidores. Tente novamente em instantes.');
        this.isLoading = false;
      }
    });
  }

  get eventosFiltrados() {
    return this.eventos.filter(ev => {
      const passaCategoria = this.categoriaAtiva === 'Todos' || ev.category === this.categoriaAtiva;
      const passaBusca = ev.name.toLowerCase().includes(this.termoBusca.toLowerCase());
      return passaCategoria && passaBusca;
    });
  }

  adicionarAoCarrinho(event: EventTicket) {
    if (!this.isLoggedIn) {
      this.abrirModal('login');
      return;
    }
    const itemExistente = this.carrinho.find(i => i.event.id === event.id);
    if (itemExistente) {
      if (itemExistente.quantity < event.availableTickets) itemExistente.quantity++;
      else this.mostrarAviso('Ops! Você atingiu o limite de ingressos disponíveis para este evento.');
    } else {
      this.carrinho.push({ event, quantity: 1 });
    }
    this.isCartOpen = true;
  }

  removerDoCarrinho(eventId: string) {
    this.carrinho = this.carrinho.filter(i => i.event.id !== eventId);
  }

  getQuantidadeCarrinho() {
    return this.carrinho.reduce((total, item) => total + item.quantity, 0);
  }

  getTotalCarrinho() {
    return this.carrinho.reduce((total, item) => total + (item.event.price! * item.quantity), 0);
  }

  finalizarCompra() {
    if (this.carrinho.length === 0) return;
    this.isProcessing = true;
    
    const item = this.carrinho[0];
    const payload = { eventId: item.event.id, quantity: item.quantity };

    this.http.post<any>('http://localhost:5130/api/reservations', payload).subscribe({
      next: (res) => {
        this.isProcessing = false;
        this.isCartOpen = false;
        this.carrinho = [];
        this.mostrarAviso(`Compra aprovada com sucesso! Seu ingresso (ID: ${res.orderId.substring(0,6)}) está garantido.`);
        this.carregarEventos(); 
      },
      error: (err) => {
        this.isProcessing = false;
        this.mostrarAviso(err.error?.message || 'Houve um problema ao processar seu pagamento. Não se preocupe, nada foi cobrado.');
      }
    });
  }

  verificarSessao() {
    this.isLoggedIn = !!localStorage.getItem('baza_jwt_token');
  }

  abrirModal(mode: 'login' | 'register') {
    this.modalMode = mode;
    this.isLoginOpen = true;
  }

  autenticar() {
    if (!this.email || !this.password) return this.mostrarAviso('Por favor, preencha todos os campos para continuar.');
    
    if (this.modalMode === 'register') {
      this.mostrarAviso('Conta VIP criada com sucesso! Verificando credenciais...');
      this.modalMode = 'login';
    }

    const cred = { email: this.email, password: this.password };
    this.http.post<any>('http://localhost:5130/api/auth/login', cred).subscribe({
      next: (res) => {
        localStorage.setItem('baza_jwt_token', res.token);
        this.isLoggedIn = true;
        this.isLoginOpen = false;
        this.mostrarAviso('Que bom te ver de volta! Aproveite os eventos.');
      },
      error: () => this.mostrarAviso('E-mail ou senha incorretos. Tente novamente.')
    });
  }

  fazerLogout() {
    localStorage.removeItem('baza_jwt_token');
    this.isLoggedIn = false;
    this.carrinho = [];
  }

  mostrarAviso(msg: string) {
    this.toastMessage = msg;
    if (this.toastTimeout) clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => this.toastMessage = '', 4500);
  }

  getIconeCategoria(cat: string) {
    const icones: any = { 'Todos': '🌟', 'Festas e Shows': '🎸', 'Teatros': '🎭', 'Stand Up': '🎤', 'Esportes': '⚽', 'Passeios': '🎡' };
    return icones[cat] || '🎟️';
  }

  enviarMensagemChat() {
    if (!this.chatInput.trim()) return;

    this.mensagensChat.push({ bot: false, texto: this.chatInput });
    const userText = this.chatInput.toLowerCase();
    this.chatInput = '';
    this.chatDigitando = true;

    setTimeout(() => {
      this.chatDigitando = false;
      let resposta = 'Certo! Para te ajudar melhor com isso, você prefere explorar nossa vitrine de shows ou quer que eu te redirecione para o e-mail de suporte?';
      
      if (userText.includes('olá') || userText.includes('oi') || userText.includes('bom dia')) {
        resposta = 'Olá! Que bom falar com você. Quer ajuda para encontrar ingressos de algum evento específico hoje?';
      } else if (userText.includes('comprar') || userText.includes('ingresso')) {
        resposta = 'Para comprar ingressos é super rápido: faça seu login ali no topo, escolha o evento desejado, clique no botão do carrinho e finalize o pedido. Nós aceitamos Pix e Cartão de Crédito! 💳';
      } else if (userText.includes('pagamento') || userText.includes('cartão') || userText.includes('pix')) {
        resposta = 'Trabalhamos com os pagamentos mais seguros do mercado! Você pode pagar via Pix com aprovação na hora, ou dividir no Cartão de Crédito em até 12x.';
      } else if (userText.includes('cadê') || userText.includes('imprimir') || userText.includes('meu ingresso')) {
        resposta = 'Não precisa imprimir nada, nós somos sustentáveis! 🌳 Seus ingressos ficam salvos digitalmente. É só acessar a aba "Meus Ingressos" para apresentar o QR Code na portaria.';
      } else if (userText.includes('erro') || userText.includes('falhou')) {
        resposta = 'Puxa, sinto muito por isso. Se a sua compra deu erro na tela final, não se preocupe: nosso sistema cancela o processo automaticamente e nenhum valor será debitado.';
      } else if (userText.includes('esgotado') || userText.includes('acabou')) {
        resposta = 'Infelizmente quando aparece a tag "Esgotado", todos os lugares já foram vendidos e o sistema trava vendas para evitar superlotação. Fique de olho que novos lotes podem abrir! 👀';
      }
      
      this.mensagensChat.push({ bot: true, texto: resposta });
    }, 1200);
  }
}