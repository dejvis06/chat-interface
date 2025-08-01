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
      name: 'Redis Master–Replica Drawbacks',
      lastMessage: 'Explored failover scenarios and retry logic.',
      timestamp: '5 mins ago',
    },
    {
      name: 'Spring AI SSE Streaming',
      lastMessage: 'Compared Flux vs SSE for browser UI.',
      timestamp: '20 mins ago',
      unreadCount: 3,
    },
  ];
}
