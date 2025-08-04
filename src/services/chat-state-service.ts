import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ChatDto, ChatMessageDto } from '../app/components/chat/chat.component';

@Injectable({ providedIn: 'root' })
export class ChatStateService {
  private messagesSubject = new BehaviorSubject<ChatDto | null>(null);
  messages$ = this.messagesSubject.asObservable();

  setMessages(chatDto: ChatDto) {
    this.messagesSubject.next(chatDto);
  }

  resetMessages() {
    this.messagesSubject.next(null);
  }
}
