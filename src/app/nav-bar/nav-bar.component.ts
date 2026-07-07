import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-nav-bar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {
  shopkeeperName: string | null = null;

  constructor(private authService: AuthService, private router: Router) {
    this.shopkeeperName = localStorage.getItem('shopkeeperName');
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
