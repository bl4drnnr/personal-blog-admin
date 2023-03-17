import { Component, OnInit } from '@angular/core';
import { ContentService } from '@services/content.service';
import { IPost } from '@models/post.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html'
})
export class PostComponent implements OnInit {
  constructor(
    private contentService: ContentService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.contentService.setTypeOfContent('posts');
  }

  post: IPost;

  async ngOnInit() {
    const postId = (this.route.snapshot.paramMap.get('id') as string) || '';

    if (!postId) await this.router.navigate(['posts']);

    await this.contentService
      .getItem({
        id: postId
      })
      .subscribe((response) => {
        this.post = response as IPost;
      });
  }
}
