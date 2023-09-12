import { Component, OnInit } from '@angular/core';
import { PostsService } from '@services/posts.service';
import { Post } from '@interfaces/post.interface';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'page-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {
  post: Post;

  constructor(
    private readonly postsService: PostsService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {}

  async handleRedirect(path: string) {
    await this.router.navigate([path]);
  }

  fetchPosts(slug: string) {
    this.postsService
      .getPostBySlug({
        slug
      })
      .subscribe({
        next: (post) => (this.post = post)
      });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(async (params) => {
      const slug = params.get('slug');
      if (!slug) await this.handleRedirect('account/dashboard');
      else this.fetchPosts(slug);
    });
  }
}
