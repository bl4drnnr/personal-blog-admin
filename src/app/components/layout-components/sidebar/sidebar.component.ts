import { Component, Input, Output, EventEmitter } from '@angular/core';

interface NavItem {
  label: string;
  route?: string;
  icon?: string;
  children?: NavItem[];
  expanded?: boolean;
}

@Component({
  selector: 'layout-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  @Input() isOpen = true;
  @Input() isMobile = false;
  @Output() closeSidebar = new EventEmitter<void>();

  navItems: NavItem[] = [
    {
      label: 'Dashboard',
      route: '/dashboard',
      icon: '🏠'
    },
    {
      label: 'Site Configuration',
      icon: '⚙️',
      children: [
        {
          label: 'Site Settings',
          route: '/admin/site/config'
        }
      ]
    },
    {
      label: 'Content Management',
      icon: '📝',
      children: [
        {
          label: 'Articles',
          route: '/admin/posts'
        },
        {
          label: 'Projects',
          route: '/admin/projects'
        },
        {
          label: 'Pages',
          route: '/admin/pages'
        }
      ]
    },
    {
      label: 'About Section',
      icon: '👤',
      children: [
        {
          label: 'About Page',
          route: '/admin/about'
        },
        {
          label: 'Experiences',
          route: '/admin/experiences'
        },
        {
          label: 'Certificates',
          route: '/admin/certificates'
        }
      ]
    },
    {
      label: 'Changelog',
      icon: '📋',
      children: [
        {
          label: 'Changelog Entries',
          route: '/admin/changelog/entries'
        },
        {
          label: 'Changelog Settings',
          route: '/admin/changelog/page'
        }
      ]
    },
    {
      label: 'License',
      icon: '⚖️',
      children: [
        {
          label: 'License Tiles',
          route: '/admin/license/tiles'
        },
        {
          label: 'License Settings',
          route: '/admin/license/page'
        }
      ]
    },
    {
      label: 'Privacy Policy',
      icon: '🔒',
      children: [
        {
          label: 'Privacy Sections',
          route: '/admin/privacy/sections'
        },
        {
          label: 'Privacy Content',
          route: '/admin/privacy/content-items'
        },
        {
          label: 'Privacy Settings',
          route: '/admin/privacy/page'
        }
      ]
    },
    {
      label: 'User Management',
      icon: '👥',
      children: [
        {
          label: 'User Info',
          route: '/users/user-info'
        },
        {
          label: 'Security Settings',
          route: '/security/settings'
        }
      ]
    }
  ];

  toggleExpanded(item: NavItem): void {
    if (item.children) {
      item.expanded = !item.expanded;
    }
  }

  onLinkClick(): void {
    if (this.isMobile) {
      this.closeSidebar.emit();
    }
  }

  onCloseClick(): void {
    this.closeSidebar.emit();
  }
}
