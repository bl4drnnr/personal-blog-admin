import { Component, OnInit } from '@angular/core';
import { ContentService } from '@services/content.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IProject } from '@models/project.model';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html'
})
export class ProjectComponent implements OnInit {
  constructor(
    private contentService: ContentService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.contentService.setTypeOfContent('projects');
  }

  project: IProject;

  async ngOnInit() {
    const projectId = (this.route.snapshot.paramMap.get('id') as string) || '';

    if (!projectId) await this.router.navigate(['projects']);

    await this.contentService
      .getItem({
        id: projectId
      })
      .subscribe((response) => {
        this.project = response as IProject;
      });
  }
}
