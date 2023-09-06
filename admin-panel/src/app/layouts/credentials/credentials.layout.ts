import { Component, Input } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'layout-credentials',
  templateUrl: './credentials.layout.html',
  styleUrls: ['./credentials.layout.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0s', style({ opacity: 0 })),
        animate('0.5s ease-in-out', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class CredentialsLayout {
  @Input() mainTitle: string;
  @Input() secondTitle: string;
  @Input() titleEmoji: string;

  constructor() {}
}
