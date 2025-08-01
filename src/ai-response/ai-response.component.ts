import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-ai-response',
  imports: [CommonModule],
  templateUrl: './ai-response.component.html',
  styleUrl: './ai-response.component.scss',
})
export class AiResponseComponent {
  @Input() response: string = '';
  @Input() loading: boolean = false;
}
