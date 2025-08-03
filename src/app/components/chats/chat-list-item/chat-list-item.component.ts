import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ChatListItem } from '../chats.component';
import { CommonModule } from '@angular/common';
import { TimeAgoPipe } from '../../../pipes/time-ago.pipe';
import { ChatDto, ChatMessageDto } from '../../chat/chat.component';
import { HttpUserEvent } from '@angular/common/http';
import { ChatService } from '../../../../services/chat-service/chat-service';
import { ChatStateService } from '../../../../services/chat-state-service';

@Component({
  selector: 'app-chat-list-item',
  imports: [CommonModule, TimeAgoPipe],
  templateUrl: './chat-list-item.component.html',
  styleUrl: './chat-list-item.component.scss',
})
export class ChatListItemComponent {
  @Input() chat!: ChatListItem;

  @Input() selectedChatId?: string; // receives the selected chat id
  @Output() chatClicked = new EventEmitter<string>();

  constructor(
    private chatService: ChatService,
    private chatStateService: ChatStateService
  ) {}

  loadMessages(chatId: string) {
    this.chatClicked.emit(this.chat.id);

    this.chatService.getMessages(chatId).subscribe({
      next: (messages) => {
        console.log(`Messages for chat ${chatId}:`, messages);

        const chatDto: ChatDto = {
          id: this.chat.id,
          name: this.chat.name,
          messages: messages,
          createdAt: this.chat.createdAt,
        };
        this.chatStateService.setMessages(chatDto);
      },
      error: (err) => {
        console.error('Error loading messages', err);
      },
    });
  }
}
