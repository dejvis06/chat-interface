import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ChatListItem } from '../../app/components/chats/chats.component';
import {
  ChatDto,
  ChatMessageDto,
} from '../../app/components/chat/chat.component';

const API_BASE_URL = 'http://localhost:8080';
const CHATS_ENDPOINT = `${API_BASE_URL}/chats`;

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private http: HttpClient) {}

  /**
   * Fetches all chats from the backend.
   */
  public getChats(): Observable<ChatListItem[]> {
    return this.http.get<ChatListItem[]>(CHATS_ENDPOINT);
  }

  /**
   * Fetches messages for a specific chat by its ID.
   */
  public getMessages(
    chatId: string,
    page: number = 0,
    size: number = 6
  ): Observable<any> {
    return this.http.get<ChatMessageDto>(
      `${CHATS_ENDPOINT}/${chatId}/messages?page=${page}&size=${size}`
    );
  }

  /**
   * Creates and persists a new Chat based on the provided user message.
   */
  createChat(userPrompt: string) {
    return this.http.post<ChatDto>(`${CHATS_ENDPOINT}`, null, {
      params: { userPrompt },
    });
  }
}
