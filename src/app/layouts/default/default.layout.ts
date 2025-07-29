import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'layout-default',
  templateUrl: './default.layout.html',
  styleUrls: ['./default.layout.scss']
})
export class DefaultLayout implements OnInit {
  @Input() showHeader = true;
  @Input() showSideBar = true;
  @Input() withPreview = false;

  isSidebarOpen = true;
  isMobile = false;

  ngOnInit() {
    this.checkScreenSize();
    this.handleResize();
  }

  private checkScreenSize() {
    this.isMobile = window.innerWidth <= 768;
    if (this.isMobile) {
      this.isSidebarOpen = false;
    }
  }

  private handleResize() {
    window.addEventListener('resize', () => {
      const wasMobile = this.isMobile;
      this.checkScreenSize();

      // If switching from mobile to desktop, open sidebar
      if (wasMobile && !this.isMobile) {
        this.isSidebarOpen = true;
      }
      // If switching from desktop to mobile, close sidebar
      else if (!wasMobile && this.isMobile) {
        this.isSidebarOpen = false;
      }
    });
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar() {
    this.isSidebarOpen = false;
  }

  onOverlayClick() {
    if (this.isMobile) {
      this.closeSidebar();
    }
  }
}
