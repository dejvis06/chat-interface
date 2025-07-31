import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MembersComponent } from '../members/members.component';
import { MessageComponent } from '../message/message.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [MembersComponent, MessageComponent],
})
export class AppComponent {
  title = 'chat-interface';
}
