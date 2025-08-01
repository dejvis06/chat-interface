import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-ai-response',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ai-response.component.html',
  styleUrls: ['./ai-response.component.scss'],
})
export class AiResponseComponent implements OnChanges {
  @Input() response: string = '';
  @Input() loading: boolean = true;

  private fullText = '';
  displayedText: string = '';
  private lastLength = 0;
  private typingTimer: any;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['response'] && this.response) {
      if (this.loading) {
        this.loading = false;
      }

      // Add only the new part of the response
      const newPart = this.response.substring(this.lastLength);
      this.fullText += newPart;
      this.lastLength = this.response.length;

      // Start typing only once
      if (!this.typingTimer) {
        this.startTypingEffect();
      }
    }
  }

  /**
   * Gradually types out the accumulated `fullText` into `displayedText`.
   *
   * - Uses a 20ms interval to reveal one additional character at a time.
   * - Continues typing until `displayedText` catches up with `fullText`.
   * - Automatically stops and clears the timer once all text is displayed,
   *   setting `typingTimer` to null so typing can resume if new text arrives.
   */
  private startTypingEffect() {
    this.typingTimer = setInterval(() => {
      // Always sync displayedText with whatever fullText has
      if (this.displayedText.length <= this.fullText.length) {
        this.displayedText = this.fullText.substring(
          0,
          this.displayedText.length + 1
        );
      } else {
        // If we’ve fully caught up, stop until new text arrives
        clearInterval(this.typingTimer);
        this.typingTimer = null;
      }
    }, 10); // typing speed
  }
}
