import { Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import { AiResponseComponent } from './ai-response/ai-response.component';
import { UserPromptComponent } from './user-prompt/user-prompt.component';
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
  @ViewChild('messagesList') private messagesList!: ElementRef;

  userMessage: string = '';
  messages: ChatMessage[] = [];

  messageControl = new FormControl('');

  constructor(private ngZone: NgZone) {}

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

    this.messages[aiIndex].content += ''; // initiate chat

    eventSource.onmessage = (event) => {
      // Forces the code inside to run in Angular's zone, ensuring change detection updates the UI immediately.
      this.ngZone.run(() => {
        this.messages[aiIndex].content += event.data;
        this.scrollToBottom();
      });
    };

    eventSource.onerror = (error) => {
      console.error('SSE error');
      eventSource.close();
    };

    eventSource.addEventListener('end', () => {
      eventSource.close();
    });

    //  Clear textarea after sending
    this.messageControl.reset();
  }

  private scrollToBottom(): void {
    try {
      this.messagesList.nativeElement.scrollTop =
        this.messagesList.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Scroll failed', err);
    }
  }
}
