import { CommonModule } from '@angular/common';
import { Component, NgZone } from '@angular/core';

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
  chats: ChatListItem[] = [];

  ngOnInit() {
    //  SSE connection
    /* const eventSource = new EventSource(
      `http://localhost:8080/chat/stream?message=${encodeURIComponent('')}`
    );
 */
    // eventSource.onmessage = (event) => {};
  }
}
