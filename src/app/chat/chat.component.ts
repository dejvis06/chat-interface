import { Component, ElementRef, Input, NgZone, ViewChild } from '@angular/core';
import { AiResponseComponent } from './ai-response/ai-response.component';
import { UserPromptComponent } from './user-prompt/user-prompt.component';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface ChatMessage {
  role: 'user' | 'ai';
  content: string;
}

export interface ChatDto {
  id: string;
  name: string;
  createdAt: string;
  messages: ChatMessageDto[];
}

export interface ChatMessageDto {
  role: 'user' | 'assistant' | 'system';
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
  @Input() chatId?: String;

  userMessage: string = '';
  messages: ChatMessage[] = [];

  messageControl = new FormControl('');

  constructor(private http: HttpClient, private ngZone: NgZone) {}

  sendMessage() {
    const userText = this.messageControl.value?.trim();
    if (!userText) return;

    //  Add user message to chat
    this.messages.push({ role: 'user', content: userText });

    //  Add placeholder AI response
    const aiIndex = this.messages.length;
    this.messages.push({ role: 'ai', content: '' });

    this.messages[aiIndex].content += ''; // initiate chat

    // Case 1: If no chatId yet -> create chat first
    if (!this.chatId) {
      this.http
        .post<ChatDto>('http://localhost:8080/chats', null, {
          params: { userPrompt: userText },
        })
        .subscribe((chat) => {
          this.chatId = chat.id; // store chatId for all future SSE calls
          this.openSseConnection(userText, aiIndex);
        });

      // Case 2: Chat already exists -> just stream
    } else {
      this.openSseConnection(userText, aiIndex);
    }

    //  Clear textarea after sending
    this.messageControl.reset();
  }

  private openSseConnection(userText: string, aiIndex: number) {
    const eventSource = new EventSource(
      `http://localhost:8080/chats/stream/${
        this.chatId
      }?userPrompt=${encodeURIComponent(userText)}`
    );

    eventSource.onmessage = (event) => {
      this.ngZone.run(() => {
        const parsed = JSON.parse(event.data);
        this.messages[aiIndex].content += parsed.text;
        this.scrollToBottom();
      });
    };

    eventSource.addEventListener('END_STREAM', () => {
      eventSource.close();
    });

    eventSource.onerror = (error) => {
      console.error('SSE error', error);
      eventSource.close();
    };
  }

  @ViewChild('messagesList') private messagesList!: ElementRef;
  private scrollToBottom(): void {
    try {
      this.messagesList.nativeElement.scrollTop =
        this.messagesList.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Scroll failed', err);
    }
  }
}
