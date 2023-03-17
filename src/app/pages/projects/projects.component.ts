import { Component, OnInit } from '@angular/core';
import { ContentService } from '@services/content.service';
import { IProject } from '@models/project.model';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html'
})
export class ProjectsComponent implements OnInit {
  constructor(private contentService: ContentService) {
    this.contentService.setTypeOfContent('projects');
  }

  public projects: Array<IProject>;
  public language = 'en';
  public page = 0;
  public pageSize = 10;
  public order = 'created_at';
  public orderBy = 'ASC';

  async ngOnInit() {
    await this.contentService
      .listItems({
        language: this.language,
        order: this.order,
        orderBy: this.orderBy,
        page: this.page,
        pageSize: this.pageSize
      })
      .subscribe((response) => {
        const { rows, count } = response as {
          rows: Array<IProject>;
          count: number;
        };
        this.projects = rows;
      });
  }
}
