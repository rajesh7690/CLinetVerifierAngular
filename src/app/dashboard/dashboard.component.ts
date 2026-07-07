import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  shopkeeperName: string | null = null;
  customers = [
    { name: 'Rajesh Kumar', email: 'rajesh@example.com', adharNumber: '123456789012', pendingBalance: 500 },
    { name: 'Anita Sharma', email: 'anita@example.com', adharNumber: '234567890123', pendingBalance: 0 },
    // ... add up to 10 customers
  ];
  constructor(private auth: AuthService, private router: Router) {
    // Example: decode token and get shopkeeper's name
    const token = this.auth.getAccessToken();
    if (token) {
      try {
        const payload = this.auth.decodeToken(token);
        this.shopkeeperName = payload?.firstName + ' ' + payload?.lastName;
        localStorage.setItem('shopkeeperName', this.shopkeeperName);
        localStorage.setItem('shopkeeperId', payload?.id??"");
      } catch {
        this.shopkeeperName = null;
      }
    }
  }

  editCustomer(customer: any) {
    console.log('Edit:', customer);
  }

  deleteCustomer(customer: any) {
    console.log('Delete:', customer);
  }
}
