import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'page-component-preview-about',
  templateUrl: './preview-about.component.html',
  styleUrl: './preview-about.component.scss'
})
export class PreviewAboutComponent implements OnInit {
  @Input() getMembers: boolean = false;
  @Input() getExperience: boolean = false;
  @Input() getCertifications: boolean = false;

  constructor() {}

  ngOnInit() {
    if (this.getMembers) console.log('test1');
    if (this.getExperience) console.log('test2');
    if (this.getCertifications) console.log('test3');
  }
}
