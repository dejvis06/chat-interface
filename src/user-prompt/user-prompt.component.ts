import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-user-prompt',
  imports: [],
  templateUrl: './user-prompt.component.html',
  styleUrl: './user-prompt.component.scss',
})
export class UserPromptComponent {
  @Input() message!: string;
}
