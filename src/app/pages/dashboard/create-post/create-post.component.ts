import { Component, OnInit } from '@angular/core';
import { UserInfoResponse } from '@responses/user-info.interface';
import { Router } from '@angular/router';
import { RefreshTokensService } from '@services/refresh-token.service';
import { GlobalMessageService } from '@shared/global-message.service';
import { PostsService } from '@services/posts.service';

interface Subsection {
  name: string;
  content: string;
  id: string;
  level: number;
  subsections: Subsection[];
}

interface Section {
  name: string;
  content: string;
  id: string;
  level: number;
  subsections: Subsection[];
}

@Component({
  selector: 'page-create-post',
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.scss'
})
export class CreatePostComponent implements OnInit {
  postName: string;
  postDescription: string;
  postTag: string;
  postTags: Array<string> = [];
  sections: Array<Section> = [];

  userInfo: UserInfoResponse;

  constructor(
    private readonly router: Router,
    private readonly postsService: PostsService,
    private readonly globalMessageService: GlobalMessageService,
    private readonly refreshTokensService: RefreshTokensService
  ) {}

  createPost() {
    this.postsService
      .createPost({
        postName: this.postName,
        postDescription: this.postDescription,
        postTags: this.postTags,
        sections: this.sections
      })
      .subscribe({
        next: async ({ link, message }) => {
          this.globalMessageService.handle({
            message
          });
          await this.handleRedirect(link);
        }
      });
  }

  async addPostTag() {
    const isTagPresent = this.postTags.find((tag) => tag === this.postTag);

    if (isTagPresent) {
      await this.globalMessageService.handleWarning({
        message: 'Tag is already on the list'
      });
    } else {
      this.postTags.push(this.postTag);
    }

    this.postTag = '';
  }

  disableCreatePostButton() {
    return (
      !this.postName ||
      !this.postDescription ||
      !this.postTags.length ||
      !this.sections.length
    );
  }

  deletePostTag(postTag: string) {
    this.postTags.splice(this.postTags.indexOf(postTag), 1);
  }

  addSection() {
    const id = 'section_' + this.sections.length;
    this.sections.push({
      name: '',
      content: '',
      id,
      level: 1,
      subsections: []
    });
  }

  addSubSection(parentSection: Section | Subsection) {
    if (parentSection.level < 3) {
      const id =
        parentSection.id + '_subsection_' + parentSection.subsections.length;
      parentSection.subsections.push({
        name: '',
        content: '',
        id,
        level: parentSection.level + 1,
        subsections: []
      });
    }
  }

  deleteSection(index: number) {
    this.sections.splice(index, 1);
  }

  deleteSubSection(parentSection: Section | Subsection, index: number) {
    parentSection.subsections.splice(index, 1);
  }

  async handleRedirect(path: string) {
    await this.router.navigate([path]);
  }

  async ngOnInit() {
    const userInfoRequest = await this.refreshTokensService.refreshTokens();

    if (userInfoRequest) {
      userInfoRequest.subscribe({
        next: (userInfo) => (this.userInfo = userInfo),
        error: async () => {
          localStorage.removeItem('_at');
          await this.handleRedirect('login');
        }
      });
    }
  }
}
