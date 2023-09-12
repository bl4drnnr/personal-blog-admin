import { Component, OnInit } from '@angular/core';
import { PostsService } from '@services/posts.service';
import { Post } from '@interfaces/post.interface';
import { Language } from '@interfaces/language.enum';
import { Order } from '@interfaces/order.type';
import { OrderBy } from '@interfaces/order-by.type';
import { PostType } from '@interfaces/post.type';
import { Router } from '@angular/router';

@Component({
  selector: 'component-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {
  language: Language = Language.EN;
  page: number = 0;
  pageSize: number = 10;
  order: Order = 'created_at';
  orderBy: OrderBy = 'DESC';
  searchQuery: string;
  postTypes: PostType = 'theory';

  posts: Array<Post>;

  constructor(
    private readonly postsService: PostsService,
    private readonly router: Router
  ) {}

  async handleRedirect(path: string) {
    await this.router.navigate([path]);
  }

  ngOnInit() {
    this.postsService
      .getAllPosts({
        language: this.language,
        page: this.page,
        pageSize: this.pageSize,
        order: this.order,
        orderBy: this.orderBy,
        searchQuery: this.searchQuery,
        postTypes: this.postTypes
      })
      .subscribe({
        next: ({ rows }) => {
          this.posts = rows;
        }
      });
  }
}
