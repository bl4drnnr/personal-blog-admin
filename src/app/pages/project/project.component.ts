import { Component } from '@angular/core';
import { ContentService } from '@services/content.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html'
})
export class ProjectComponent {
  constructor(private contentService: ContentService) {
    this.contentService.setTypeOfContent('projects');
  }

  async ngOnInit() {
    //
  }
}
