import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface GlobalMessage {
  message: string;
  isError?: boolean;
  isWarning?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class GlobalMessageService {
  message$ = new Subject<string>();
  isError = false;
  isWarning = false;

  handle({ message, isError = false, isWarning = false }: GlobalMessage) {
    this.message$.next(message);
    this.isError = isError;
    this.isWarning = isWarning;

    setTimeout(() => {
      this.clear();
    }, 10000);
  }

  handleError(message: string) {
    this.handle({ message, isError: true });
  }

  handleWarning(message: string) {
    this.handle({ message, isWarning: true });
  }

  clear() {
    this.message$.next('');
    this.isError = false;
    this.isWarning = false;
  }
}
