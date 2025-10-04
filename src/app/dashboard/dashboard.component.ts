import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink,RouterOutlet],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  shopkeeperName: string | null = null;

  constructor(private auth: AuthService, private router: Router) {
    // Example: decode token and get shopkeeper's name
    const token = this.auth.getAccessToken();
    if (token) {
      try {
        const payload = this.auth.decodeToken(token);
        this.shopkeeperName = payload?.firstName + ' ' + payload?.lastName;
      } catch {
        this.shopkeeperName = null;
      }
    }
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
