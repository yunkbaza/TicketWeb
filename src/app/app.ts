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
    <div class="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300 selection:bg-rose-500/30 relative overflow-x-hidden">
      
      <nav class="fixed top-0 w-full z-[100] bg-white/90 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-800/50 transition-all">
        <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 h-20 flex items-center justify-between gap-4">
          
          <div class="flex items-center gap-2.5 shrink-0 cursor-pointer group">
            <div class="w-9 h-9 bg-rose-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 text-white"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z" /></svg>
            </div>
            <h1 class="text-2xl font-black tracking-tighter text-slate-950 dark:text-white hidden sm:block">BAZA<span class="text-rose-600 dark:text-rose-500">TICKET</span></h1>
          </div>
          
          <div class="hidden md:flex flex-1 max-w-3xl items-center gap-2">
            <div class="flex items-center bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full px-5 py-2.5 w-full focus-within:ring-2 focus-within:ring-rose-500 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 text-slate-400 dark:text-slate-500 mr-2"><path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
              <input type="text" placeholder="Busque experiências..." class="bg-transparent border-none outline-none text-sm w-full text-slate-950 dark:text-white placeholder-slate-500 dark:placeholder-slate-600">
            </div>
            
            <button class="shrink-0 flex items-center gap-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 px-5 py-2.5 rounded-full text-sm font-semibold hover:border-rose-500 dark:hover:border-rose-500 transition-colors focus-visible:ring-2 focus-visible:ring-rose-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 text-rose-600 dark:text-rose-400"><path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>
              São Paulo, SP
            </button>
          </div>

          <div class="flex items-center gap-4 shrink-0">
            <ng-container *ngIf="!isLoggedIn">
              <button (click)="isLoginOpen = true" class="text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 transition-colors">Entrar</button>
              <button (click)="isLoginOpen = true" class="bg-rose-600 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-rose-700 transition-all active:scale-95 shadow-sm">Criar Conta</button>
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

      <button class="fixed top-24 left-0 z-40 bg-rose-600 text-white p-2.5 rounded-r-xl shadow-xl hover:pr-5 hover:bg-rose-700 transition-all focus-visible:ring-4 focus-visible:ring-rose-500/50 group flex items-center" aria-label="Opções de Acessibilidade">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 8.25a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 15.75v-1.5a2.25 2.25 0 0 1 2.25-2.25h3a2.25 2.25 0 0 1 2.25 2.25v1.5m-9 0h9m-9 0a2.25 2.25 0 0 0 2.25 2.25h4.5a2.25 2.25 0 0 0 2.25-2.25m-9 0V18m9-2.25V18" /><path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" /></svg>
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
            <button class="py-4 px-8 bg-white text-slate-900 rounded-full font-bold shadow-lg hover:scale-105 active:scale-95 transition-all text-sm w-fit flex items-center gap-2 group mt-6">
              Ver Detalhes 
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4 text-slate-400 group-hover:text-rose-600 transition-colors"><path stroke-linecap="round" stroke-linejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" /></svg>
            </button>
          </div>
        </div>
      </header>

      <main class="mt-16 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        <section aria-labelledby="section-sp-title" class="mb-16">
          <div class="flex justify-between items-end mb-8 border-b border-slate-200 dark:border-slate-800/50 pb-6">
            <h3 class="text-3xl font-black uppercase tracking-tighter text-slate-950 dark:text-white">O que fazer em São Paulo</h3>
          </div>

          <div *ngIf="eventos.length === 0" class="py-24 text-center border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-3xl bg-slate-50 dark:bg-slate-900/50">
            <div class="w-10 h-10 border-4 border-slate-200 dark:border-slate-800 border-t-rose-600 rounded-full animate-spin mx-auto mb-5 shadow-md"></div>
            <p class="text-slate-700 dark:text-slate-300 font-semibold text-lg">Sincronizando vitrine...</p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            <article *ngFor="let event of eventos" class="group flex flex-col bg-transparent cursor-pointer outline-none p-1 focus-within:ring-2 focus-within:ring-rose-500 rounded-2xl">
              <div class="relative w-full aspect-[4/5] bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden mb-5 shadow-sm group-hover:shadow-lg transition-all duration-300">
                <div class="absolute inset-0 bg-gradient-to-tr from-rose-950/20 to-slate-950/10 z-10 group-hover:opacity-0 transition-opacity"></div>
                <div class="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=800&auto=format&fit=crop')] bg-cover bg-center group-hover:scale-105 transition-transform duration-700"></div>
                <div *ngIf="event.isSoldOut" class="absolute top-4 left-4 bg-red-600 text-white font-black px-4 py-1.5 rounded-lg text-[10px] uppercase tracking-widest z-20 shadow-xl rotate-[-5deg]">Esgotado</div>
              </div>

              <div class="flex-1 flex flex-col px-1">
                <h4 class="text-xl font-extrabold text-slate-950 dark:text-white leading-tight mb-2 group-hover:text-rose-600 transition-colors line-clamp-2 tracking-tight">{{ event.name }}</h4>
                <div class="flex items-center gap-2 text-rose-600 dark:text-rose-400 text-sm font-bold mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" /></svg>
                  {{ event.eventDate | date:"dd 'de' MMMM" }}
                </div>

                <div class="mt-auto flex items-center justify-between gap-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-3 rounded-xl">
                  <span class="text-xs font-bold text-slate-600 dark:text-slate-400 tracking-tight">{{ event.availableTickets }} Restantes</span>
                  <button (click)="comprar(event.id); $event.stopPropagation()" [disabled]="event.isSoldOut" class="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-2.5 rounded-full text-xs font-bold transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 shadow">
                    {{ event.isSoldOut ? 'Encerrado' : 'Comprar' }}
                  </button>
                </div>
              </div>
            </article>
          </div>
        </section>
      </main>

      <div *ngIf="isChatOpen" class="fixed bottom-24 right-8 z-[150] w-80 sm:w-96 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-fade-in-up" role="dialog" aria-label="BazaHelp Assistente Virtual">
        
        <div class="bg-rose-600 p-4 flex justify-between items-center text-white">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-xl shadow-inner">🤖</div>
            <div>
              <h4 class="font-black text-sm leading-tight tracking-tight">BazaHelp</h4>
              <span class="text-[10px] font-bold text-rose-200 flex items-center gap-1">
                <span class="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span> Online
              </span>
            </div>
          </div>
          <button (click)="isChatOpen = false" class="text-rose-200 hover:text-white transition-colors p-1 rounded focus:ring-2 focus:ring-white outline-none" aria-label="Fechar chat">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div class="flex-1 h-80 p-4 overflow-y-auto bg-slate-50 dark:bg-slate-950 flex flex-col gap-4">
          <div *ngFor="let msg of mensagensChat" [ngClass]="msg.bot ? 'items-start' : 'items-end'" class="flex flex-col w-full">
            <div [ngClass]="msg.bot ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-br-2xl border border-slate-100 dark:border-slate-700' : 'bg-rose-600 text-white rounded-bl-2xl shadow-rose-600/20'" class="p-3.5 rounded-t-2xl max-w-[85%] text-sm font-medium shadow-sm leading-relaxed">
              {{ msg.texto }}
            </div>
            <span class="text-[10px] text-slate-400 font-semibold mt-1 px-1">{{ msg.bot ? 'Assistente Baza' : 'Você' }}</span>
          </div>
          
          <div *ngIf="chatDigitando" class="flex items-start w-full animate-pulse">
            <div class="bg-white dark:bg-slate-800 p-3 rounded-2xl rounded-bl-none border border-slate-100 dark:border-slate-700 flex gap-1.5 items-center">
              <span class="w-1.5 h-1.5 bg-slate-400 rounded-full"></span>
              <span class="w-1.5 h-1.5 bg-slate-400 rounded-full"></span>
              <span class="w-1.5 h-1.5 bg-slate-400 rounded-full"></span>
            </div>
          </div>
        </div>

        <div class="p-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
          <input [(ngModel)]="chatInput" (keyup.enter)="enviarMensagemChat()" type="text" placeholder="Tire sua dúvida..." class="flex-1 bg-slate-100 dark:bg-slate-950 border border-transparent dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all placeholder:text-slate-500">
          <button (click)="enviarMensagemChat()" [disabled]="!chatInput.trim() || chatDigitando" class="w-12 h-12 shrink-0 bg-rose-600 text-white rounded-xl flex items-center justify-center hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 outline-none" aria-label="Enviar mensagem">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 -ml-0.5"><path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" /></svg>
          </button>
        </div>
      </div>

      <button (click)="isChatOpen = !isChatOpen" class="fixed bottom-8 right-8 z-50 bg-slate-950 dark:bg-white text-white dark:text-slate-950 p-4 rounded-full shadow-2xl hover:scale-110 transition-transform focus-visible:ring-4 focus-visible:ring-rose-500/50 flex items-center justify-center group outline-none" aria-label="Abrir chat de ajuda">
        <svg *ngIf="!isChatOpen" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-7 h-7"><path stroke-linecap="round" stroke-linejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" /></svg>
        <svg *ngIf="isChatOpen" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-7 h-7"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
        
        <span *ngIf="!isChatOpen" class="absolute right-full mr-4 bg-slate-950 dark:bg-white text-white dark:text-slate-900 text-sm font-bold py-2.5 px-5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl">
          Olá, BazaHelp! 👋
        </span>
      </button>

      <div *ngIf="isLoginOpen" class="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-sm p-4">
        <div class="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 relative animate-fade-in-up">
          <button (click)="isLoginOpen = false" class="absolute top-6 right-6 text-slate-400 hover:text-red-500 transition-colors outline-none focus:ring-2 focus:ring-rose-500 rounded"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" /></svg></button>
          
          <div class="p-9 pb-7 text-center border-b border-slate-100 dark:border-slate-800">
            <div class="w-14 h-14 bg-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-rose-600/20"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-white"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z" /></svg></div>
            <h2 class="text-3xl font-black tracking-tight text-slate-950 dark:text-white">Acesse sua conta</h2>
          </div>
          
          <div class="p-9 pt-7 space-y-6">
            <div>
              <label class="block text-sm font-semibold text-slate-800 dark:text-slate-300 mb-2">E-mail</label>
              <input [(ngModel)]="email" type="email" placeholder="seu@email.com" class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-5 py-4 text-slate-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all placeholder:text-slate-400">
            </div>
            <div>
              <div class="flex justify-between items-center mb-2">
                <label class="block text-sm font-semibold text-slate-800 dark:text-slate-300">Senha</label>
              </div>
              <input [(ngModel)]="password" type="password" placeholder="••••••••" class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-5 py-4 text-slate-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all">
            </div>
            <button (click)="autenticar()" class="w-full bg-rose-600 text-white font-black py-4 rounded-xl hover:bg-rose-700 transition-all active:scale-95 shadow-lg shadow-rose-600/20 mt-3 text-base outline-none focus:ring-4 focus:ring-rose-500/50">Entrar</button>
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
    .animate-fade-in-up { animation: fadeInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
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
  categorias = ['Festas e Shows', 'Teatros', 'Stand Up', 'Esportes', 'Passeios'];

  // Controle do Chatbot
  isChatOpen = false;
  chatDigitando = false;
  chatInput = '';
  mensagensChat = [
    { bot: true, texto: 'Olá VIP! Sou o BazaHelp. Pode me perguntar como comprar ingressos ou como nossa arquitetura super rápida funciona! ⚡' }
  ];

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
      return;
    }

    const payload = { eventId: id, quantity: 1 };

    this.http.post<any>('http://localhost:5130/api/reservations', payload).subscribe({
      next: (res) => {
        alert(`🎉 SUCESSO!\n${res.message}\nSeu ID de Pedido é: ${res.orderId}\n\nOlhe o terminal do seu Backend, o RabbitMQ já deve estar processando o pagamento!`);
        this.carregarEventos(); 
      },
      error: (err) => {
        console.error('Erro na compra:', err);
        alert(err.error?.message || 'Erro ao processar a reserva. Verifique os serviços C# e o RabbitMQ.');
      }
    });
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
      error: () => alert('A rota de Login falhou! Verifique a chave JWT no GatewayService.')
    });
  }

  fazerLogout() {
    localStorage.removeItem('baza_jwt_token');
    this.isLoggedIn = false;
  }

  // Lógica Inteligente do BazaHelp
  enviarMensagemChat() {
    if (!this.chatInput.trim()) return;

    const textoUsuario = this.chatInput;
    this.mensagensChat.push({ bot: false, texto: textoUsuario });
    this.chatInput = '';
    this.chatDigitando = true;

    // Lógica simples do chatbot
    const textoFormatado = textoUsuario.toLowerCase();

    // Simula a latência de uma IA pensando...
    setTimeout(() => {
      this.chatDigitando = false;
      let resposta = '';

      if (textoFormatado.includes('comprar') || textoFormatado.includes('ingresso') || textoFormatado.includes('como funciona')) {
        resposta = 'É muito fácil! Basta fazer login, escolher um evento e clicar em "Comprar". Usamos o padrão SAGA no backend para garantir que ninguém fure a fila do seu ingresso.';
      } else if (textoFormatado.includes('erro') || textoFormatado.includes('falhou') || textoFormatado.includes('pagamento')) {
        resposta = 'Se o seu pagamento for recusado, nossa arquitetura devolve o ingresso para a prateleira automaticamente. Nada é perdido! 💳';
      } else if (textoFormatado.includes('esgotado') || textoFormatado.includes('acabou')) {
        resposta = 'Usamos locks no MongoDB! Se a tela diz "Esgotado", significa que bloqueamos novas requisições em nível de banco de dados para evitar overbooking (vender o mesmo lugar 2 vezes).';
      } else {
        resposta = 'Que incrível! Nossa plataforma foi inteiramente desenhada com .NET 10, Angular 18 e RabbitMQ para suportar milhares de fãs ao mesmo tempo. Pode explorar a vontade! 🚀';
      }

      this.mensagensChat.push({ bot: true, texto: resposta });
    }, 1500);
  }
}