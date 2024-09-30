import { Component, OnInit } from '@angular/core';
import { AuthorsService } from '@services/authors.service';
import { GetSelectedAuthorResponse } from '@responses/get-selected-author.interface';

@Component({
  selector: 'page-component-preview-about',
  templateUrl: './preview-about.component.html',
  styleUrls: ['../shared/preview-about.styles.scss', '../shared/preview.styles.scss']
})
export class PreviewAboutComponent implements OnInit {
  author: GetSelectedAuthorResponse;

  constructor(private readonly authorsService: AuthorsService) {}

  getSelectedAuthor() {
    this.authorsService.getSelectedAuthor().subscribe({
      next: (author) => (this.author = author)
    });
  }

  ngOnInit() {
    this.getSelectedAuthor();
  }
}
