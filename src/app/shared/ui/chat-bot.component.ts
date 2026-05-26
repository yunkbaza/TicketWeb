import { Component, ElementRef, ViewChild, AfterViewChecked, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../../core/i18n/language.service';

@Component({
  selector: 'app-chat-bot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div *ngIf="isOpen()" class="fixed bottom-24 right-4 md:right-8 z-[150] w-[90vw] md:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl flex flex-col animate-fade-in-up transition-colors duration-300">
      
      <div class="bg-[#780a43] p-4 flex justify-between items-center text-white rounded-t-3xl">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center shadow-inner border border-white/20 backdrop-blur-sm">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.104a2.25 2.25 0 00-.215-4.471 2.25 2.25 0 00-2.035 2.502L5.5 14.5m4.25-11.396v5.714a2.25 2.25 0 00.659 1.591L15 14.5M9.75 3.104c.251.023.501.05.75.082m-.75-.104a2.25 2.25 0 01.215-4.471 2.25 2.25 0 012.035 2.502L13.5 14.5m4.25-11.396v5.714a2.25 2.25 0 01-.659 1.591L15 14.5" /></svg>
          </div>
          <div>
            <h4 class="font-black text-sm leading-tight tracking-tight">{{ lang.t().chat.title }}</h4>
            <span class="text-[10px] font-bold text-[#fbcfe8] flex items-center gap-1">
              <span class="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span> Online
            </span>
          </div>
        </div>
        <button (click)="isOpen.set(false)" class="text-[#fbcfe8] hover:text-white p-1 rounded-md outline-none transition-colors">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <div #chatScroll class="h-80 p-4 overflow-y-auto bg-slate-50 dark:bg-slate-950/50 flex flex-col gap-4">
        <div *ngFor="let msg of messages()" [ngClass]="msg.bot ? 'items-start' : 'items-end'" class="flex flex-col w-full">
          <div [ngClass]="msg.bot ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-br-2xl border border-slate-200 dark:border-slate-700' : 'bg-[#780a43] text-white rounded-bl-2xl shadow-sm'" 
               class="p-3.5 rounded-t-2xl max-w-[85%] text-sm font-medium leading-relaxed">
            {{ msg.texto }}
          </div>
        </div>
        <div *ngIf="isTyping()" class="flex items-start w-full animate-pulse">
          <div class="bg-white dark:bg-slate-800 p-3 rounded-2xl rounded-bl-none border border-slate-200 dark:border-slate-700 flex gap-1.5 items-center">
            <span class="w-1.5 h-1.5 bg-slate-400 rounded-full"></span><span class="w-1.5 h-1.5 bg-slate-400 rounded-full"></span><span class="w-1.5 h-1.5 bg-slate-400 rounded-full"></span>
          </div>
        </div>
      </div>

      <div class="p-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 rounded-b-3xl">
        <input [(ngModel)]="input" (keyup.enter)="send()" type="text" 
               [placeholder]="lang.t().chat.placeholder" 
               class="flex-1 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#780a43]">
        <button (click)="send()" [disabled]="!input.trim() || isTyping()" 
                class="w-12 h-12 bg-[#780a43] text-white rounded-xl flex items-center justify-center hover:bg-[#600835] disabled:opacity-50 transition-colors outline-none">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" /></svg>
        </button>
      </div>
    </div>

    <button (click)="toggleChat()" class="fixed bottom-6 right-4 md:bottom-8 md:right-8 z-[140] bg-[#780a43] text-white p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all outline-none">
      <svg *ngIf="!isOpen()" class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" /></svg>
      <svg *ngIf="isOpen()" class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
    </button>
  `
})
export class ChatBotComponent implements AfterViewChecked {
  @ViewChild('chatScroll') private chatScrollContainer!: ElementRef;
  
  public lang = inject(LanguageService);
  
  isOpen = signal(false);
  isTyping = signal(false);
  input = '';
  messages = signal<{bot: boolean, texto: string}[]>([]);

  toggleChat() {
    this.isOpen.set(!this.isOpen());
    if (this.isOpen() && this.messages().length === 0) {
      this.messages.set([{ bot: true, texto: this.lang.t().chat.welcome }]);
    }
  }

  ngAfterViewChecked() {
    if (this.chatScrollContainer) {
      this.chatScrollContainer.nativeElement.scrollTop = this.chatScrollContainer.nativeElement.scrollHeight;
    }
  }

  send() {
    if (!this.input.trim()) return;
    
    this.messages.update(m => [...m, { bot: false, texto: this.input }]);
    this.input = '';
    this.isTyping.set(true);
    
    setTimeout(() => {
      this.isTyping.set(false);
      this.messages.update(m => [...m, { bot: true, texto: this.lang.t().chat.reply }]);
    }, 1500);
  }
}