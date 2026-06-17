import { Injectable, signal, inject } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { ToastService } from '../../shared/ui/toast/toast.service';

@Injectable({ providedIn: 'root' })
export class SignalRService {
  private hubConnection!: signalR.HubConnection;
  private toast = inject(ToastService);
  
  // Sinal que guarda a última atualização de stock
  public liveStockUpdates = signal<{eventId: string, available: number} | null>(null);

  constructor() {
    this.startConnection();
  }

  public startConnection() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5130/hubs/ticket') // Liga-se ao Gateway
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start()
      .then(() => {
        console.log('⚡ Conectado ao SignalR Hub (Gateway)');
        this.addStockListener();
      })
      .catch(err => console.error('Erro de conexão ao SignalR:', err));
  }

  private addStockListener() {
    // Fica à escuta de mensagens do C# chamadas "UpdateStock"
    this.hubConnection.on('UpdateStock', (eventId: string, availableTickets: number) => {
      this.liveStockUpdates.set({ eventId, available: availableTickets });
      this.toast.show(`🔥 Dinâmica de mercado: Restam apenas ${availableTickets} bilhetes para este evento!`);
    });
  }
}