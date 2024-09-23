import { Component, Input } from '@angular/core';

@Component({
  selector: 'component-about-team-cell',
  templateUrl: './about-team-cell.component.html',
  styleUrl: './about-team-cell.component.scss'
})
export class AboutTeamCellComponent {
  @Input() image: string;
  @Input() title: string;
  @Input() subtitle: string;
  @Input() description: string;
  @Input() socialLinks: Array<string>;
}
