import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

export interface ChatListItem {
  name: string; // e.g. "John Doe"
  lastMessage: string; // e.g. "Hello, Are you there?"
  timestamp: string; // e.g. "Just now"
  unreadCount?: number; // optional, e.g. 1 (badge only shows if > 0)
}

@Component({
  selector: 'app-chats',
  imports: [CommonModule],
  templateUrl: './chats.component.html',
  styleUrl: './chats.component.scss',
})
export class ChatsComponent {
  chats: ChatListItem[] = [
    {
      name: 'John Doe',
      lastMessage: 'Hello, Are you there?',
      timestamp: 'Just now',
      unreadCount: 1,
    },
    {
      name: 'Danny Smith',
      lastMessage: 'Lorem ipsum dolor sit.',
      timestamp: '5 mins ago',
      // no unreadCount here (badge won’t show)
    },
  ];
}
