import { Component } from '@angular/core';
import { ChatsComponent } from './components/chats/chats.component';
import { ChatComponent, ChatDto } from './components/chat/chat.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [ChatsComponent, ChatComponent],
})
export class AppComponent {
  title = 'chat-AI';

  createdChat?: ChatDto;

  // Called when ChatComponent emits a new chat
  onChatCreated(chat: ChatDto) {
    this.createdChat = chat;
  }
}
