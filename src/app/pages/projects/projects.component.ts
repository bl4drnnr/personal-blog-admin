import { Component } from '@angular/core';
import { ContentService } from '@services/content.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html'
})
export class ProjectsComponent {
  constructor(private contentService: ContentService) {
    this.contentService.setTypeOfContent('projects');
  }

  async ngOnInit() {
    //
  }
}
