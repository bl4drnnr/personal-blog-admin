import { Component, Input } from '@angular/core';

interface Subsection {
  id: string;
  name: string;
  subsections?: Subsection[];
}

interface Section {
  id: string;
  name: string;
  subsections?: Subsection[];
}

@Component({
  selector: 'dashboard-table-of-contents',
  templateUrl: './table-of-contents.component.html',
  styleUrl: './table-of-contents.component.scss'
})
export class TableOfContentsComponent {
  @Input() sections: Array<Section> = [];
}
