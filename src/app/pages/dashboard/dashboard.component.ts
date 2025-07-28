import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '@services/authentication.service';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h1>Admin Dashboard</h1>
        <button class="logout-btn" (click)="handleLogout()">Logout</button>
      </div>
      <p>Welcome to the admin panel!</p>
      <p>Dashboard content will be implemented here.</p>
    </div>
  `,
  styles: [
    `
      .dashboard-container {
        padding: 2rem;
        max-width: 1200px;
        margin: 0 auto;
      }

      .dashboard-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
      }

      h1 {
        color: #333;
        margin: 0;
      }

      p {
        color: #666;
        margin-bottom: 0.5rem;
      }

      .logout-btn {
        background-color: #dc3545;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.875rem;
        transition: background-color 0.2s;
      }

      .logout-btn:hover {
        background-color: #c82333;
      }
    `
  ]
})
export class DashboardComponent {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  handleLogout() {
    this.authenticationService.logout().subscribe({
      next: () => {
        localStorage.removeItem('_at');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Logout error:', error);
        // Even if logout fails on server, clear local token and redirect
        localStorage.removeItem('_at');
        this.router.navigate(['/login']);
      }
    });
  }
}
