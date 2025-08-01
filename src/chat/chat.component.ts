import { Component, NgZone } from '@angular/core';
import { AiResponseComponent } from '../ai-response/ai-response.component';
import { UserPromptComponent } from '../user-prompt/user-prompt.component';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

interface ChatMessage {
  role: 'user' | 'ai';
  content: string;
}

@Component({
  selector: 'app-chat',
  imports: [
    AiResponseComponent,
    UserPromptComponent,
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent {
  userMessage: string = '';
  isStreaming: boolean = false;
  messages: ChatMessage[] = [];

  constructor(private ngZone: NgZone) {}

  messageControl = new FormControl('');
  /*   sendMessage() {
    if (!this.userMessage.trim()) return;

    //  Push user message
    this.messages.push({ role: 'user', content: this.userMessage });

    //  Push mock AI reply (for now)
    this.messages.push({
      role: 'ai',
      content: '⚓ Mock AI reply to: ' + this.userMessage,
    });

    //  Clear the input
    this.userMessage = '';
  } */

  sendMessage() {
    const userText = this.messageControl.value?.trim();
    if (!userText) return;

    //  Add user message to chat
    this.messages.push({ role: 'user', content: userText });

    //  Add placeholder AI response
    const aiIndex = this.messages.length;
    this.messages.push({ role: 'ai', content: '' });

    //  SSE connection
    const eventSource = new EventSource(
      `http://localhost:8080/mock/chat/stream?message=${encodeURIComponent(
        userText
      )}`
    );

    this.isStreaming = true;

    eventSource.onmessage = (event) => {
      //  Wrap UI update in NgZone so Angular knows about it
      this.ngZone.run(() => {
        this.messages[aiIndex].content += event.data;
        console.log('Updated AI content:', this.messages[aiIndex].content);
      });
    };

    eventSource.onerror = (error) => {
      console.error('SSE error');
      eventSource.close();
      this.isStreaming = false;
    };

    eventSource.addEventListener('end', () => {
      eventSource.close();
      this.isStreaming = false;
    });

    //  Clear textarea after sending
    this.messageControl.reset();
  }
}
