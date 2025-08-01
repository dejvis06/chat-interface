import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MembersComponent } from '../members/members.component';
import { MessageComponent } from '../message/message.component';
import { ChatsComponent } from '../chats/chats.component';
import { ChatComponent } from '../chat/chat.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [ChatsComponent, ChatComponent],
})
export class AppComponent {
  title = 'chat-AI';
}
