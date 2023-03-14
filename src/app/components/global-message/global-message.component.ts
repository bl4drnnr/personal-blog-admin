import { Component } from '@angular/core';
import { GlobalMessageService } from '@services/global-message.service';

@Component({
  selector: 'app-global-message',
  templateUrl: './global-message.component.html'
})
export class GlobalMessageComponent {
  constructor(public globalMessageService: GlobalMessageService) {}
}
