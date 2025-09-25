import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RefreshTokensService } from '@services/refresh-token.service';
import { Title } from '@angular/platform-browser';
import { BaseAdminComponent } from '@shared/components/base-admin.component';
import { DeploymentService } from '@services/deployment.service';
import { GlobalMessageService } from '@shared/global-message.service';

@Component({
  selector: 'page-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
interface DashboardTile {
  title: string;
  description: string;
  icon: string;
  route: string;
}

interface QuickAction {
  title: string;
  icon: string;
  route?: string;
  type: 'link' | 'deployment';
  buttonClass?: string;
}

interface FilteredTiles {
  quickStats: DashboardTile[];
  quickActions: QuickAction[];
  contentManagement: DashboardTile[];
  aboutSection: DashboardTile[];
  legalInfo: DashboardTile[];
  systemManagement: DashboardTile[];
}

export class DashboardComponent extends BaseAdminComponent implements OnInit {
  deploymentInProgress = false;
  searchQuery = '';

  allTiles: FilteredTiles = {
    quickStats: [
      { title: 'Articles', description: 'Manage your blog posts', icon: '📝', route: '/admin/posts' },
      { title: 'Projects', description: 'Showcase your work', icon: '🚀', route: '/admin/projects' },
      { title: 'Pages', description: 'Static content management', icon: '📄', route: '/admin/pages' },
      { title: 'Settings', description: 'Site configuration', icon: '⚙️', route: '/admin/site/config' }
    ],
    quickActions: [
      { title: 'Create New Article', icon: '➕', route: '/admin/posts', type: 'link', buttonClass: 'primary' },
      { title: 'Add New Project', icon: '🔧', route: '/admin/projects', type: 'link', buttonClass: 'secondary' },
      { title: 'Site Settings', icon: '⚙️', route: '/admin/site/config', type: 'link', buttonClass: 'tertiary' },
      { title: 'Trigger Deployment', icon: '🚀', type: 'deployment' }
    ],
    contentManagement: [
      { title: 'Articles', description: 'Manage blog posts', icon: '📄', route: '/admin/posts' },
      { title: 'Projects', description: 'Showcase portfolio', icon: '🚀', route: '/admin/projects' },
      { title: 'Pages', description: 'Static content', icon: '📋', route: '/admin/pages' },
      { title: 'Contact Messages', description: 'User inquiries', icon: '✉️', route: '/admin/contact/messages' },
      { title: 'Static Assets', description: 'Media management', icon: '🎨', route: '/admin/static-assets' },
      { title: 'Newsletter Subscriptions', description: 'Email subscribers', icon: '📧', route: '/admin/newsletters/subscriptions' },
      { title: 'Menu Tiles', description: 'Navigation tiles', icon: '🗂️', route: '/admin/menu/tiles' },
      { title: 'Menu Settings', description: 'Page configuration', icon: '⚙️', route: '/admin/menu/page' },
      { title: 'Social Links', description: 'Manage social media links', icon: '🔗', route: '/admin/social-links' },
      { title: 'Copyright', description: 'Manage copyright information', icon: '©️', route: '/admin/copyright' }
    ],
    aboutSection: [
      { title: 'About Page', description: 'Personal information', icon: '📖', route: '/admin/about' },
      { title: 'Experiences', description: 'Work history', icon: '💼', route: '/admin/experiences' },
      { title: 'Certificates', description: 'Achievements', icon: '🏆', route: '/admin/certificates' }
    ],
    legalInfo: [
      { title: 'Changelog Entries', description: 'Version history', icon: '📝', route: '/admin/changelog/entries' },
      { title: 'Changelog Settings', description: 'Page configuration', icon: '⚙️', route: '/admin/changelog/page' },
      { title: 'License Tiles', description: 'License information', icon: '⚖️', route: '/admin/license/tiles' },
      { title: 'License Settings', description: 'Page configuration', icon: '⚙️', route: '/admin/license/page' },
      { title: 'Privacy Sections', description: 'Privacy policy content', icon: '🔒', route: '/admin/privacy/sections' },
      { title: 'Privacy Settings', description: 'Page configuration', icon: '⚙️', route: '/admin/privacy/page' },
      { title: 'Not Found Page', description: '404 error page content', icon: '❗', route: '/admin/not-found' }
    ],
    systemManagement: [
      { title: 'Site Configuration', description: 'Global settings', icon: '🌐', route: '/admin/site/config' },
      { title: 'User Info', description: 'Account details', icon: '👤', route: '/users/user-info' },
      { title: 'Security Settings', description: '2FA & authentication', icon: '🔐', route: '/security/settings' },
      { title: 'Maintenance Mode', description: 'Site maintenance control', icon: '🔧', route: '/admin/maintenance' },
      { title: 'Password Protection', description: 'Temporary site access control', icon: '🔐', route: '/admin/password-protection' }
    ]
  };

  filteredTiles: FilteredTiles = { ...this.allTiles };

  constructor(
    protected override router: Router,
    protected override refreshTokensService: RefreshTokensService,
    private titleService: Title,
    private deploymentService: DeploymentService,
    private globalMessageService: GlobalMessageService
  ) {
    super(router, refreshTokensService);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.initializeFilteredTiles();
  }

  protected override onUserInfoLoaded(): void {
    this.titleService.setTitle(this.getPageTitle());
  }

  private getPageTitle(): string {
    return 'Personal Blog | Dashboard';
  }

  triggerDeployment(): void {
    if (this.deploymentInProgress) {
      return;
    }

    this.deploymentInProgress = true;

    this.deploymentService.triggerDeployment().subscribe({
      next: (response) => {
        this.deploymentInProgress = false;
        if (response.status === 'success') {
          this.globalMessageService.handle({
            message: response.message,
            isError: false
          });
        } else {
          this.globalMessageService.handle({
            message: response.message,
            isError: true
          });
        }
      },
      error: () => {
        this.deploymentInProgress = false;
        this.globalMessageService.handle({
          message: 'Failed to trigger deployment. Please check your configuration.',
          isError: true
        });
      }
    });
  }

  initializeFilteredTiles(): void {
    this.filteredTiles = {
      quickStats: [...this.allTiles.quickStats],
      quickActions: [...this.allTiles.quickActions],
      contentManagement: [...this.allTiles.contentManagement],
      aboutSection: [...this.allTiles.aboutSection],
      legalInfo: [...this.allTiles.legalInfo],
      systemManagement: [...this.allTiles.systemManagement]
    };
  }

  onSearchChange(): void {
    if (!this.searchQuery.trim()) {
      this.initializeFilteredTiles();
      return;
    }

    const query = this.searchQuery.toLowerCase().trim();

    this.filteredTiles = {
      quickStats: this.filterTiles(this.allTiles.quickStats, query),
      quickActions: this.filterQuickActions(this.allTiles.quickActions, query),
      contentManagement: this.filterTiles(this.allTiles.contentManagement, query),
      aboutSection: this.filterTiles(this.allTiles.aboutSection, query),
      legalInfo: this.filterTiles(this.allTiles.legalInfo, query),
      systemManagement: this.filterTiles(this.allTiles.systemManagement, query)
    };
  }

  private filterTiles(tiles: DashboardTile[], query: string): DashboardTile[] {
    return tiles.filter(tile =>
      tile.title.toLowerCase().includes(query) ||
      tile.description.toLowerCase().includes(query) ||
      tile.route.toLowerCase().includes(query)
    );
  }

  private filterQuickActions(actions: QuickAction[], query: string): QuickAction[] {
    return actions.filter(action =>
      action.title.toLowerCase().includes(query) ||
      (action.route && action.route.toLowerCase().includes(query))
    );
  }
}
