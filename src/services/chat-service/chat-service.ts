import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ChatListItem } from '../../app/components/chats/chats.component';

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
    size: number = 10
  ): Observable<any> {
    return this.http.get<any>(
      `${CHATS_ENDPOINT}/${chatId}/messages?page=${page}&size=${size}`
    );
  }
}
