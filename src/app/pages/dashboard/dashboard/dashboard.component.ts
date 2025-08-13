import { Component } from '@angular/core';
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
export class DashboardComponent extends BaseAdminComponent {
  deploymentInProgress = false;

  constructor(
    protected override router: Router,
    protected override refreshTokensService: RefreshTokensService,
    private titleService: Title,
    private deploymentService: DeploymentService,
    private globalMessageService: GlobalMessageService
  ) {
    super(router, refreshTokensService);
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
}
