import { Component, OnInit } from '@angular/core';
import { ContentService } from '@services/content.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html'
})
export class PostComponent {
  constructor(private contentService: ContentService) {
    this.contentService.setTypeOfContent('posts');
  }

  async ngOnInit() {
    //
  }
}
