import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { AiResponseComponent } from './ai-response/ai-response.component';
import { UserPromptComponent } from './user-prompt/user-prompt.component';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ChatService } from '../../../services/chat-service/chat-service';
import { ChatStateService } from '../../../services/chat-state-service';
import { take } from 'rxjs';

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
export class ChatComponent implements OnInit {
  @Input() chatId?: string | null;

  userMessage: string = '';
  messages: ChatMessageDto[] = [];

  typingEffect = true;

  messageControl = new FormControl('');

  constructor(
    private chatService: ChatService,
    private ngZone: NgZone,
    private chatStateService: ChatStateService
  ) {}

  /**
   * Subscribes to chat state changes.
   * - On new chat: disables typing effect, sets chatId and messages, and scrolls to bottom.
   * - On chat selected: clears component state
   */
  ngOnInit(): void {
    this.chatStateService.chat$.subscribe((chatDto) => {
      if (!chatDto) {
        this.resetState();
        return;
      }
      this.typingEffect = false;
      this.chatId = chatDto!.id;
      this.messages = [...chatDto.messages].reverse();
      this.ngZone.onStable.pipe(take(1)).subscribe(() => {
        this.scrollToBottom();
      });
    });
  }

  @Output() chatCreated = new EventEmitter<ChatDto>();
  sendMessage() {
    this.typingEffect = true;

    const userText = this.messageControl.value?.trim();
    if (!userText) return;

    //  Add user message to chat
    this.messages.push({ role: 'user', content: userText });

    //  Add placeholder AI response
    const aiIndex = this.messages.length;
    this.messages.push({ role: 'assistant', content: '' });

    this.messages[aiIndex].content += ''; // initiate chat

    // Case 1: If no chatId yet -> create chat first
    if (!this.chatId) {
      this.chatService.createChat(userText).subscribe((chat) => {
        this.chatCreated.emit(chat); // Emit new chat to AppComponent

        this.chatId = chat.id; // store chatId for all future SSE calls
        this.openSseConnection(userText, aiIndex);
      });
    } else {
      // Chat already exists -> just stream
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

  currentPage = 0; // starts at latest page (1 = newest, 2 = older, etc.)
  pageSize = 10;
  loadingOlder = false;
  onScroll(): void {
    const el = this.messagesList.nativeElement;
    if (el.scrollTop === 0 && !this.loadingOlder) {
      this.loadOlderMessages();
    }
  }

  loadOlderMessages(): void {
    this.loadingOlder = true;
    this.currentPage += 1;

    this.chatService
      .getMessages(this.chatId!, this.currentPage, this.pageSize)
      .subscribe((olderMessages) => {
        console.log(olderMessages);
        // Save current scroll position
        const el = this.messagesList.nativeElement;
        const previousHeight = el.scrollHeight;

        // Prepend messages as-is (no reverse)
        this.messages = [...olderMessages, ...this.messages];

        this.ngZone.onStable.pipe(take(1)).subscribe(() => {
          const newHeight = el.scrollHeight;
          el.scrollTop = newHeight - previousHeight;
          this.loadingOlder = false;
        });
      });
  }

  private resetState() {
    this.messages = [];
    this.messageControl.reset();
    this.chatId = null;
    this.currentPage = 0;
    this.pageSize = 10;
    this.loadingOlder = false;
  }
}
