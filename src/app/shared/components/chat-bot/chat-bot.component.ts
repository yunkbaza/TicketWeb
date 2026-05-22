import { Component, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat-bot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: './chat-bot.component.html'
  })
export class ChatBotComponent implements AfterViewChecked {
  @ViewChild('chatScroll') private chatScrollContainer!: ElementRef;
  isChatOpen = false;
  chatDigitando = false;
  chatInput = '';
  mensagensChat = [{ bot: true, texto: 'Olá! Sou a assistente Baza. Como posso ajudar?' }];

  ngAfterViewChecked() {
    if (this.chatScrollContainer) this.chatScrollContainer.nativeElement.scrollTop = this.chatScrollContainer.nativeElement.scrollHeight;
  }

  enviar() {
    if (!this.chatInput.trim()) return;
    this.mensagensChat.push({ bot: false, texto: this.chatInput });
    
    // Suas lógicas de keywords
    const userText = this.chatInput.toLowerCase();
    this.chatInput = '';
    this.chatDigitando = true;
    
    setTimeout(() => {
      this.chatDigitando = false;
      let resposta = 'Qualquer dúvida sobre a sua compra com Stripe, estou aqui para ajudar!';
      if (userText.includes('comprar') || userText.includes('ingresso')) {
        resposta = 'Para comprar ingressos é super rápido: faça seu login ali no topo, escolha o evento desejado, clique no ícone do carrinho e finalize com Stripe.';
      } else if (userText.includes('cadê') || userText.includes('imprimir')) {
        resposta = 'Não precisa imprimir nada! Seus ingressos ficam salvos digitalmente na aba "Meus Ingressos".';
      }
      this.mensagensChat.push({ bot: true, texto: resposta });
    }, 1200);
  }
}