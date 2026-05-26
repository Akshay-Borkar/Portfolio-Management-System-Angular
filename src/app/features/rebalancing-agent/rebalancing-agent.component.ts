import { Component, ElementRef, OnDestroy, OnInit, ViewChild, inject, signal } from '@angular/core';
import { SharedModule } from '../../shared/modules/shared.module';
import { PortfolioService } from '../../core/services/portfolio.service';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

@Component({
  selector: 'app-rebalancing-agent',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './rebalancing-agent.component.html',
  styleUrl: './rebalancing-agent.component.css',
})
export class RebalancingAgentComponent implements OnInit, OnDestroy {
  private readonly portfolioService = inject(PortfolioService);

  @ViewChild('chatHistory') chatHistoryRef!: ElementRef<HTMLDivElement>;

  messages = signal<ChatMessage[]>([]);
  streamingContent = signal('');
  loading = signal(false);
  userInput = '';
  sessionId = '';

  readonly suggestedPrompts = [
    'What is my current sector allocation?',
    'Rebalance to 40% IT, 30% Banking, 20% Pharma, 10% Other',
    'Am I overweight in any sector?',
    'Are markets open right now?',
  ];

  ngOnInit(): void {
    this.sessionId = `rebalancing-${crypto.randomUUID()}`;
  }

  ngOnDestroy(): void {
    this.portfolioService.clearRebalancingSession(this.sessionId).subscribe();
  }

  get showSuggestions(): boolean {
    return this.messages().length === 0;
  }

  sendMessage(): void {
    const text = this.userInput.trim();
    if (!text || this.loading()) return;

    this.messages.update((msgs) => [...msgs, { role: 'user', content: text }]);
    this.userInput = '';
    this.loading.set(true);
    this.streamingContent.set('');
    this.scrollToBottom();

    let accumulated = '';

    this.portfolioService.streamRebalancingChat(text, this.sessionId).subscribe({
      next: (chunk) => {
        accumulated += chunk;
        this.streamingContent.set(accumulated);
        this.scrollToBottom();
      },
      complete: () => {
        if (accumulated) {
          this.messages.update((msgs) => [
            ...msgs,
            { role: 'assistant', content: accumulated },
          ]);
        }
        this.streamingContent.set('');
        this.loading.set(false);
        this.scrollToBottom();
      },
      error: () => {
        this.messages.update((msgs) => [
          ...msgs,
          { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' },
        ]);
        this.streamingContent.set('');
        this.loading.set(false);
        this.scrollToBottom();
      },
    });
  }

  sendSuggestion(prompt: string): void {
    this.userInput = prompt;
    this.sendMessage();
  }

  clearSession(): void {
    this.portfolioService.clearRebalancingSession(this.sessionId).subscribe();
    this.sessionId = `rebalancing-${crypto.randomUUID()}`;
    this.messages.set([]);
    this.streamingContent.set('');
  }

  scrollToBottom(): void {
    setTimeout(() => {
      if (this.chatHistoryRef?.nativeElement) {
        this.chatHistoryRef.nativeElement.scrollTop =
          this.chatHistoryRef.nativeElement.scrollHeight;
      }
    }, 50);
  }
}
