import { Component, ElementRef, ViewChild, inject, signal } from '@angular/core';
import { SharedModule } from '../../shared/modules/shared.module';
import { PortfolioService } from '../../core/services/portfolio.service';
import { DocumentUploadComponent } from './document-upload/document-upload.component';
import { DocumentListComponent } from './document-list/document-list.component';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [SharedModule, DocumentUploadComponent, DocumentListComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent {
  private readonly portfolioService = inject(PortfolioService);

  @ViewChild('chatHistory') chatHistoryRef!: ElementRef<HTMLDivElement>;
  @ViewChild(DocumentListComponent) docList!: DocumentListComponent;

  messages = signal<ChatMessage[]>([]);
  streamingContent = signal('');
  loading = signal(false);
  sidebarOpen = signal(true);
  userInput = '';

  readonly suggestedQuestions = [
    'How is my overall portfolio performing?',
    'Which stock has the best and worst returns?',
    'How diversified am I across sectors?',
    'Which of my holdings are currently at a loss?',
  ];

  sendMessage(): void {
    const text = this.userInput.trim();
    if (!text || this.loading()) return;

    this.messages.update((msgs) => [...msgs, { role: 'user', content: text }]);
    this.userInput = '';
    this.loading.set(true);
    this.streamingContent.set('');
    this.scrollToBottom();

    let accumulated = '';

    this.portfolioService.streamChat(text).subscribe({
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
          {
            role: 'assistant',
            content: 'Sorry, something went wrong. Please try again.',
          },
        ]);
        this.streamingContent.set('');
        this.loading.set(false);
        this.scrollToBottom();
      },
    });
  }

  sendSuggestion(question: string): void {
    this.userInput = question;
    this.sendMessage();
  }

  onDocumentUploaded(): void {
    this.docList?.load();
  }

  toggleSidebar(): void {
    this.sidebarOpen.update((v) => !v);
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
