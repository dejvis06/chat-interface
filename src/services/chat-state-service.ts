import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ChatDto, ChatMessageDto } from '../app/components/chat/chat.component';

@Injectable({ providedIn: 'root' })
export class ChatStateService {
  private chatSubject = new BehaviorSubject<ChatDto | null>(null);
  chat$ = this.chatSubject.asObservable();

  setChat(chatDto: ChatDto) {
    this.chatSubject.next(chatDto);
  }

  resetChat() {
    this.chatSubject.next(null);
  }
}
