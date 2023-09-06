import { Component, OnInit } from '@angular/core';
import { RefreshTokensService } from '@services/refresh-tokens.service';

@Component({
  selector: 'component-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  constructor(private readonly refreshTokensService: RefreshTokensService) {}

  async ngOnInit() {
    await this.refreshTokensService.refreshTokens();
  }
}
