import { Component } from '@angular/core';
import { ContentService } from '@services/content.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html'
})
export class PostsComponent {
  constructor(private contentService: ContentService) {
    this.contentService.setTypeOfContent('posts');
  }

  async ngOnInit() {
    //
  }
}
