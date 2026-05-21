import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { EventTicket } from '../../../core/models/event-ticket.model';

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './event-card.component.html'
})
export class EventCardComponent {
  @Input({ required: true })
  event!: EventTicket;

  @Output()
  add = new EventEmitter<void>();
}