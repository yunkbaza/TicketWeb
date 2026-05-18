import { Component, OnInit, inject } from '@angular/core';
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
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300 selection:bg-rose-500/30 relative">
      
      <nav class="fixed top-0 w-full z-[100] bg-white/90 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-800/50 transition-all">
        <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 h-20 flex items-center justify-between gap-4">
          
          <div class="flex items-center gap-2.5 shrink-0 cursor-pointer group">
            <div class="w-9 h-9 bg-rose-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 text-white">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z" />
              </svg>
            </div>
            <h1 class="text-2xl font-black tracking-tighter text-slate-950 dark:text-white hidden sm:block">
              BAZA<span class="text-rose-600 dark:text-rose-500">TICKET</span>
            </h1>
          </div>
          
          <div class="hidden md:flex flex-1 max-w-3xl items-center gap-2">
            <div class="flex items-center bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full px-5 py-2.5 w-full focus-within:ring-2 focus-within:ring-rose-500 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 text-slate-400 dark:text-slate-500 mr-2">
                <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
              <input type="text" placeholder="Busque experiências..." class="bg-transparent border-none outline-none text-sm w-full text-slate-950 dark:text-white placeholder-slate-500 dark:placeholder-slate-600">
            </div>
            
            <button class="shrink-0 flex items-center gap-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 px-5 py-2.5 rounded-full text-sm font-semibold hover:border-rose-500 dark:hover:border-rose-500 transition-colors focus-visible:ring-2 focus-visible:ring-rose-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 text-rose-600 dark:text-rose-400">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
              </svg>
              São Paulo, SP
            </button>
          </div>

          <div class="flex items-center gap-4 shrink-0">
            <ng-container *ngIf="!isLoggedIn">
              <button (click)="isLoginOpen = true" class="text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 transition-colors">Entrar</button>
              <button (click)="isLoginOpen = true" class="bg-rose-600 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-rose-700 transition-all active:scale-95 shadow-sm">
                Criar Conta
              </button>
            </ng-container>

            <ng-container *ngIf="isLoggedIn">
              <span class="hidden lg:block text-sm font-bold text-slate-600 dark:text-slate-400">Olá, Usuário VIP</span>
              <div class="w-10 h-10 bg-gradient-to-tr from-rose-500 to-orange-400 rounded-full border-2 border-white dark:border-slate-800 shadow-md flex items-center justify-center cursor-pointer relative group">
                <span class="text-white font-bold text-sm">B</span>
                <div class="absolute top-full right-0 mt-3 w-40 bg-white dark:bg-slate-900 rounded-xl shadow-xl p-2 border border-slate-100 dark:border-slate-800 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
                  <button class="w-full text-left p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-sm text-slate-700 dark:text-slate-300">Perfil</button>
                  <button (click)="fazerLogout()" class="w-full text-left p-2 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-lg text-sm text-red-600">Sair</button>
                </div>
              </div>
            </ng-container>
          </div>
        </div>
      </nav>

      <button class="fixed top-24 left-0 z-40 bg-rose-600 text-white p-2.5 rounded-r-xl shadow-xl hover:pr-5 hover:bg-rose-700 transition-all focus-visible:ring-4 focus-visible:ring-rose-500/50 group flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 8.25a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 15.75v-1.5a2.25 2.25 0 0 1 2.25-2.25h3a2.25 2.25 0 0 1 2.25 2.25v1.5m-9 0h9m-9 0a2.25 2.25 0 0 0 2.25 2.25h4.5a2.25 2.25 0 0 0 2.25-2.25m-9 0V18m9-2.25V18" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
        </svg>
        <span class="hidden group-hover:inline-block ml-2 text-sm font-bold">Acessibilidade</span>
      </button>

      <header class="relative w-full h-[80vh] pt-20 border-b border-slate-200 dark:border-slate-800/50 overflow-hidden">
        <div class="absolute inset-0 bg-cover bg-center transition-transform duration-1000" style="background-image: url('https://images.unsplash.com/photo-1540039155733-d7696d8ba620?q=80&w=2500&auto=format&fit=crop');">
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent"></div>
        </div>

        <div class="max-w-[1400px] mx-auto px-6 lg:px-8 h-full flex flex-col justify-end pb-16 relative z-10">
          <div class="max-w-3xl animate-fade-in-up">
            <span class="py-1 px-3 bg-rose-600 rounded-full text-xs font-bold text-white mb-2 max-w-fit">Destaque da Semana</span>
            <h2 class="text-4xl md:text-6xl font-black leading-tight text-white mb-3 tracking-tighter shadow-text">ROCK IN BAZA: THE FESTIVAL</h2>
            <p class="text-slate-200 text-base md:text-lg font-medium mb-6 flex gap-3 items-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 text-rose-500"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" /></svg>
              <span>Sábado, 20 de Maio de 2026</span>
              <span class="text-slate-500 mx-2">|</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 text-rose-500"><path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>
              <span>Estádio Baza, São Paulo</span>
            </p>
            <button class="py-4 px-8 bg-white text-slate-900 rounded-full font-bold shadow-lg hover:scale-105 active:scale-95 transition-all text-sm w-fit flex items-center gap-2 group">
              Ver Detalhes 
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4 text-slate-400 group-hover:text-rose-600 transition-colors">
                <path stroke-linecap="round" stroke-linejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main class="mt-20 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <section class="mb-14">
          <div class="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
            <button *ngFor="let cat of categorias" class="snap-start shrink-0 flex flex-col items-center gap-3 w-32 p-5 bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 rounded-2xl hover:border-rose-400 dark:hover:border-rose-500 hover:shadow-md transition-all focus-visible:ring-2 focus-visible:ring-rose-500">
              <div class="w-14 h-14 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-rose-600 dark:text-rose-400 shadow-inner">
                
                <ng-container [ngSwitch]="cat">
                  <svg *ngSwitchCase="'Festas e Shows'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-7 h-7"><path stroke-linecap="round" stroke-linejoin="round" d="m9 9 10.5-3m0 6.553v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66a2.25 2.25 0 0 0 1.632-2.163Zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 0 1-.99-3.467l2.31-.66A2.25 2.25 0 0 0 9 15.553Z" /></svg>
                  <svg *ngSwitchCase="'Teatros'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-7 h-7"><path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" /></svg>
                  <svg *ngSwitchCase="'Stand Up'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-7 h-7"><path stroke-linecap="round" stroke-linejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" /></svg>
                  <svg *ngSwitchCase="'Esportes'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-7 h-7"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0" /></svg>
                  <svg *ngSwitchCase="'Passeios'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-7 h-7"><path stroke-linecap="round" stroke-linejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" /></svg>
                </ng-container>

              </div>
              <span class="text-xs font-bold text-center text-slate-700 dark:text-slate-300 tracking-tight">{{ cat }}</span>
            </button>
          </div>
        </section>

        <section class="mb-16">
          <div class="flex justify-between items-end mb-8 border-b border-slate-200 dark:border-slate-800/50 pb-6">
            <h3 class="text-3xl font-black uppercase tracking-tighter text-slate-950 dark:text-white">O que fazer em São Paulo</h3>
            <a href="#" class="text-sm font-bold text-rose-600 dark:text-rose-400 hover:underline">Ver todos →</a>
          </div>

          <div *ngIf="eventos.length === 0" class="py-24 text-center border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-3xl bg-slate-50 dark:bg-slate-900/50">
            <div class="w-10 h-10 border-4 border-slate-200 dark:border-slate-800 border-t-rose-600 rounded-full animate-spin mx-auto mb-5 shadow-md"></div>
            <p class="text-slate-700 dark:text-slate-300 font-semibold text-lg">Sincronizando com a rede distribuída...</p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            
            <article *ngFor="let event of eventos" class="group flex flex-col bg-transparent cursor-pointer focus-within:ring-2 focus-within:ring-rose-500 rounded-2xl outline-none p-1">
              
              <div class="relative w-full aspect-[4/5] bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden mb-5 shadow-sm group-hover:shadow-lg dark:group-hover:shadow-rose-600/10 transition-all duration-300">
                <div class="absolute inset-0 bg-gradient-to-tr from-rose-950/20 to-slate-950/10 z-10 group-hover:opacity-0 transition-opacity"></div>
                <div class="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=800&auto=format&fit=crop')] bg-cover bg-center group-hover:scale-105 transition-transform duration-700"></div>
                
                <div *ngIf="event.isSoldOut" class="absolute top-4 left-4 bg-red-600 text-white dark:bg-white dark:text-slate-950 font-black px-4 py-1.5 rounded-lg text-[10px] uppercase tracking-widest z-20 shadow-xl rotate-[-5deg]">
                  Esgotado
                </div>
              </div>

              <div class="flex-1 flex flex-col px-1">
                <h4 class="text-xl font-extrabold text-slate-950 dark:text-white leading-tight mb-2 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors line-clamp-2 tracking-tight">
                  {{ event.name }}
                </h4>
                
                <div class="flex items-center gap-2 text-rose-600 dark:text-rose-400 text-sm font-bold mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" /></svg>
                  {{ event.eventDate | date:"dd 'de' MMMM" }}
                </div>

                <div class="mt-auto flex items-center justify-between gap-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-3 rounded-xl">
                  <span class="text-xs font-bold text-slate-600 dark:text-slate-400 tracking-tight">
                    {{ event.availableTickets }} Restantes
                  </span>
                  
                  <button 
                    (click)="comprar(event.id); $event.stopPropagation()"
                    [disabled]="event.isSoldOut"
                    class="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-2.5 rounded-full text-xs font-bold transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 shadow disabled:cursor-not-allowed">
                    {{ event.isSoldOut ? 'Encerrado' : 'Comprar' }}
                  </button>
                </div>
              </div>
            </article>

          </div>
        </section>
      </main>

      <button class="fixed bottom-8 right-8 z-50 bg-slate-950 dark:bg-white text-white dark:text-slate-950 p-4 rounded-full shadow-2xl hover:scale-110 transition-transform focus-visible:ring-4 focus-visible:ring-rose-500/50 flex items-center justify-center group">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" /></svg>
        <span class="absolute right-full mr-4 bg-slate-950 dark:bg-white text-white dark:text-slate-900 text-sm font-bold py-2.5 px-5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl">
          Olá, BazaHelp! 👋
        </span>
      </button>

      <div *ngIf="isLoginOpen" class="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-sm p-4">
        <div class="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 relative animate-fade-in-up">
          <button (click)="isLoginOpen = false" class="absolute top-6 right-6 text-slate-400 hover:text-red-500 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
          </button>
          
          <div class="p-9 pb-7 text-center border-b border-slate-100 dark:border-slate-800">
            <div class="w-14 h-14 bg-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-rose-600/20">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-white"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z" /></svg>
            </div>
            <h2 class="text-3xl font-black tracking-tight text-slate-950 dark:text-white">Acesse sua conta</h2>
            <p class="text-base text-slate-500 dark:text-slate-500 mt-2 font-medium">BazaTicket: Experiências Inesquecíveis.</p>
          </div>
          
          <div class="p-9 pt-7 space-y-6">
            <div>
              <label class="block text-sm font-semibold text-slate-800 dark:text-slate-300 mb-2">E-mail</label>
              <input [(ngModel)]="email" type="email" placeholder="seu@email.com" class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-5 py-4 text-slate-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all placeholder:text-slate-400">
            </div>
            <div>
              <div class="flex justify-between items-center mb-2">
                <label class="block text-sm font-semibold text-slate-800 dark:text-slate-300">Senha</label>
                <a href="#" class="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline">Esqueceu?</a>
              </div>
              <input [(ngModel)]="password" type="password" placeholder="••••••••" class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-5 py-4 text-slate-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all">
            </div>
            
            <button (click)="autenticar()" class="w-full bg-rose-600 text-white font-black py-4 rounded-xl hover:bg-rose-700 transition-all active:scale-95 shadow-lg shadow-rose-600/20 mt-3 text-base">
              Entrar
            </button>
          </div>
        </div>
      </div>

    </div>
  `,
  styles: [`
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px) scale(0.95); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    .animate-fade-in-up {
      animation: fadeInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    .shadow-text { text-shadow: 0 4px 6px rgba(0,0,0,0.3); }
    .scrollbar-hide::-webkit-scrollbar { display: none; }
    .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
  `]
})
export class AppComponent implements OnInit {
  private http = inject(HttpClient);
  
  eventos: EventTicket[] = [];
  isLoginOpen = false;
  isLoggedIn = false;
  email = '';
  password = '';

  // Lista para gerenciar as categorias do ngSwitch
  categorias = ['Festas e Shows', 'Teatros', 'Stand Up', 'Esportes', 'Passeios'];

  ngOnInit() {
    this.carregarEventos();
    this.verificarSessao();
  }

  carregarEventos() {
    this.http.get<EventTicket[]>('http://localhost:5130/api/events').subscribe({
      next: (dados) => this.eventos = dados,
      error: (err) => console.error('Erro ao carregar eventos:', err)
    });
  }

  verificarSessao() {
    this.isLoggedIn = !!localStorage.getItem('baza_jwt_token');
  }

  comprar(id: string) {
    if (!this.isLoggedIn) {
      this.isLoginOpen = true;
    } else {
      alert(`VIP Autenticado! Iniciando compra do evento ${id}...`);
    }
  }

  autenticar() {
    if (!this.email || !this.password) return alert('Preencha os campos!');
    
    const cred = { email: this.email, password: this.password };
    this.http.post<any>('http://localhost:5130/api/auth/login', cred).subscribe({
      next: (res) => {
        localStorage.setItem('baza_jwt_token', res.token);
        this.isLoggedIn = true;
        this.isLoginOpen = false;
        this.email = '';
        this.password = '';
      },
      error: () => alert('A rota de Login (Identity) no C# ainda precisa ser criada!')
    });
  }

  fazerLogout() {
    localStorage.removeItem('baza_jwt_token');
    this.isLoggedIn = false;
  }
}