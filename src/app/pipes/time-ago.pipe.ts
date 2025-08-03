import { Pipe, PipeTransform, NgZone, ChangeDetectorRef } from '@angular/core';

@Pipe({
  name: 'timeAgo',
  standalone: true,
  pure: false, // still impure, but we control updates ourselves
})
export class TimeAgoPipe implements PipeTransform {
  private lastValue?: string;
  private timer?: any;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  transform(value: unknown): string {
    if (!value) return '';

    // Start the timer only once per value
    if (this.lastValue !== value) {
      this.lastValue = value as string;
      this.clearTimer();
      this.initTimer();
    }

    return this.formatTimeAgo(new Date(value as string));
  }

  private initTimer() {
    // Run outside Angular so it doesn't trigger extra change detection
    this.ngZone.runOutsideAngular(() => {
      this.timer = setInterval(() => {
        this.ngZone.run(() => this.changeDetector.markForCheck()); // trigger refresh every minute
      }, 60000); // ✅ every 60 seconds
    });
  }

  private clearTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  private formatTimeAgo(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);

    if (diffSeconds < 5) return 'just now';
    if (diffSeconds < 60)
      return `${diffSeconds} sec${diffSeconds > 1 ? 's' : ''} ago`;

    const diffMinutes = Math.floor(diffSeconds / 60);
    if (diffMinutes < 60)
      return `${diffMinutes} min${diffMinutes > 1 ? 's' : ''} ago`;

    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24)
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;

    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  }

  // Cleanup when the component using this pipe is destroyed
  ngOnDestroy(): void {
    this.clearTimer();
  }
}
