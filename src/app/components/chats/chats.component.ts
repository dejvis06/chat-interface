import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  NgZone,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { ChatListItemComponent } from './chat-list-item/chat-list-item.component';
import { HttpClient } from '@angular/common/http';
import { ChatService } from '../../../services/chat-service/chat-service';
import { ChatDto } from '../chat/chat.component';
import { timestamp } from 'rxjs';
import { ChatStateService } from '../../../services/chat-state-service';

export interface ChatListItem {
  id: string;
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

  constructor(
    private chatService: ChatService,
    private chatStateService: ChatStateService
  ) {}

  ngOnInit() {
    this.loadChats();
  }

  ngOnChanges() {
    // When a new chat is emitted, add it to the list
    if (this.chat) {
      const chatListItem: ChatListItem = {
        id: this.chat.id,
        name: this.chat.name,
        createdAt: this.chat.createdAt,
        lastMessage: '',
      };
      this.chats.unshift(chatListItem);
    }
    this.chatStateService.chat$.subscribe((chatDto) => {
      if (!chatDto) {
        // Reset selected chat
        this.selectedChatId = null;
      }
    });
  }

  loadChats() {
    this.loading = true;
    this.chatService.getChats().subscribe({
      next: (data) => {
        setTimeout(() => {
          this.chats = data;
          this.loading = false;
        }, 500);
      },
      error: (err) => {
        console.error('Error loading chats', err);
      },
    });
  }

  selectedChatId?: string | null;
  onChatClick(chatId: string) {
    this.selectedChatId = chatId;
  }

  resetChatComponent() {
    this.chatStateService.resetChat();
  }
}
