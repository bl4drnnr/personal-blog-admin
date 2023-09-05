import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HandleGlobalMessageInterface } from '@interfaces/handle-global-message.interface';

@Injectable({
  providedIn: 'root'
})
export class GlobalMessageService {
  message$ = new Subject<string>();
  isError = false;

  constructor() {}

  handle({ message, isError = false }: HandleGlobalMessageInterface) {
    this.message$.next(message);
    this.isError = isError;
  }

  async handleError({ message }: HandleGlobalMessageInterface) {
    this.handle({ message, isError: true });
  }

  clear() {
    this.message$.next('');
    this.isError = false;
  }
}
