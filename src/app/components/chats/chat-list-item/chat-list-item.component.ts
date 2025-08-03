import { Component, Input } from '@angular/core';
import { ChatListItem } from '../chats.component';
import { CommonModule } from '@angular/common';
import { TimeAgoPipe } from '../../../pipes/time-ago.pipe';

@Component({
  selector: 'app-chat-list-item',
  imports: [CommonModule, TimeAgoPipe],
  templateUrl: './chat-list-item.component.html',
  styleUrl: './chat-list-item.component.scss',
})
export class ChatListItemComponent {
  @Input() chat!: ChatListItem;
}
