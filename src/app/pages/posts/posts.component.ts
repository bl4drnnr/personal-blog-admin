import { Component, OnInit } from '@angular/core';
import { ContentService } from '@services/content.service';
import { IPost } from '@models/post.model';
import {Router} from "@angular/router";

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html'
})
export class PostsComponent implements OnInit {
  constructor(
    private contentService: ContentService,
    private router: Router
  ) {
    this.contentService.setTypeOfContent('posts');
  }

  public posts: Array<IPost>;
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
          rows: Array<IPost>;
          count: number;
        };
        this.posts = rows;
      });
  }

  redirectToPost({ id }: { id: string | undefined }) {
    return this.router.navigate([`post/${id}`]);
  }
}
