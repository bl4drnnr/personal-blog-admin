import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '@services/authentication.service';

@Component({
  selector: 'layout-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Output() toggleSidebar = new EventEmitter<void>();

  isUserLoggedIn = false;

  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly router: Router
  ) {}

  async handleRedirect(path: string) {
    await this.router.navigate([path]);
  }

  logout() {
    this.authenticationService.logout().subscribe({
      next: () => this.logoutUser(),
      error: () => this.logoutUser()
    });
  }

  async logoutUser() {
    localStorage.removeItem('_at');
    this.isUserLoggedIn = false;
    await this.handleRedirect('login');
  }

  ngOnInit() {
    const accessToken = localStorage.getItem('_at');
    this.isUserLoggedIn = !!accessToken;
  }
}
