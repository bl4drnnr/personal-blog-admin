import { Component, Input } from '@angular/core';

@Component({
  selector: 'layout-default',
  templateUrl: './default.layout.html',
  styleUrls: ['./default.layout.scss']
})
export class DefaultLayout {
  @Input() showHeader = true;
  @Input() showHeaderBurger = true;

  @Input() showFooter = true;
  @Input() showSideBar = true;
  @Input() withPreview = false;

  isSidebarOpen = false;
}
