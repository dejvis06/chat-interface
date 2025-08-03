import { Component, Input } from '@angular/core';
import { ChatListItem } from '../chats.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat-list-item',
  imports: [CommonModule],
  templateUrl: './chat-list-item.component.html',
  styleUrl: './chat-list-item.component.scss',
})
export class ChatListItemComponent {
  @Input() chat!: ChatListItem;
}
