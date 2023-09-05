import { Component, Input } from '@angular/core';

@Component({
  selector: 'layout-credentials',
  templateUrl: './credentials.layout.html',
  styleUrls: ['./credentials.layout.scss']
})
export class CredentialsLayout {
  @Input() mainTitle: string;
  @Input() secondTitle: string;
  @Input() titleEmoji: string;

  constructor() {}
}
