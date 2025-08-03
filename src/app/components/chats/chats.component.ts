import { CommonModule } from '@angular/common';
import { Component, NgZone } from '@angular/core';
import { ChatListItemComponent } from './chat-list-item/chat-list-item.component';
import { HttpClient } from '@angular/common/http';
import { ChatService } from '../../../services/chat-service/chat-service';

export interface ChatListItem {
  name: string;
  lastMessage: string;
  timestamp: string;
}

@Component({
  selector: 'app-chats',
  imports: [CommonModule, ChatListItemComponent],
  templateUrl: './chats.component.html',
  styleUrl: './chats.component.scss',
})
export class ChatsComponent {
  chats: ChatListItem[] = [];

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    this.loadChats();
  }

  loadChats() {
    this.chatService.getChats().subscribe({
      next: (data) => {
        this.chats = data;
        console.log('Chats loaded:', this.chats);
      },
      error: (err) => {
        console.error('Error loading chats', err);
      },
    });
  }
}
