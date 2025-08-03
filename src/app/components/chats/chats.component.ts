import { CommonModule } from '@angular/common';
import { Component, Input, NgZone, OnChanges, OnInit } from '@angular/core';
import { ChatListItemComponent } from './chat-list-item/chat-list-item.component';
import { HttpClient } from '@angular/common/http';
import { ChatService } from '../../../services/chat-service/chat-service';
import { ChatDto } from '../chat/chat.component';
import { timestamp } from 'rxjs';

export interface ChatListItem {
  name: string;
  lastMessage: string;
  createdAt: string;
}

@Component({
  selector: 'app-chats',
  imports: [CommonModule, ChatListItemComponent],
  templateUrl: './chats.component.html',
  styleUrl: './chats.component.scss',
})
export class ChatsComponent implements OnChanges, OnInit {
  chats: ChatListItem[] = [];
  loading!: boolean;

  @Input() chat?: ChatDto;

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    this.loadChats();
  }

  ngOnChanges() {
    // When a new chat is emitted, add it to the list
    if (this.chat) {
      const chatListItem: ChatListItem = {
        name: this.chat.name,
        createdAt: this.chat.createdAt,
        lastMessage: '',
      };
      this.chats.unshift(chatListItem);
    }
  }

  loadChats() {
    this.loading = true;
    this.chatService.getChats().subscribe({
      next: (data) => {
        setTimeout(() => {
          this.chats = data;
          console.log('Chats loaded:', this.chats);
          this.loading = false;
        }, 2000);
      },
      error: (err) => {
        console.error('Error loading chats', err);
      },
    });
  }
}
