import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { CustomerService } from '../customer/customer.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  shopkeeperName: string | null = null;
  customers: any[] = [];
  loading = false;
  message = '';
  editingCustomerId: number | null = null;
  editForm: any = null;
  searchTerm = '';
  globalSearch = false;

  constructor(private auth: AuthService, private router: Router, private customerService: CustomerService) {}

  ngOnInit(): void {
    this.loadShopkeeperName();
    this.loadCustomers();
  }

  loadShopkeeperName(): void {
    const token = this.auth.getAccessToken();
    if (token) {
      const payload = this.auth.decodeToken(token);
      this.shopkeeperName = `${payload?.firstName ?? ''} ${payload?.lastName ?? ''}`.trim();
      localStorage.setItem('shopkeeperName', this.shopkeeperName || 'Shopkeeper');
      localStorage.setItem('shopkeeperId', payload?.id ?? '');
    }
  }

  get totalPendingBalance(): number {
    return this.customers.reduce((sum, customer) => sum + (Number(customer.pendingBalance) || 0), 0);
  }

  get searchModeLabel(): string {
    return this.globalSearch ? 'Global lookup' : 'Your shop customers';
  }

  loadCustomers(): void {
    this.loading = true;
    this.customerService.getCustomers(this.searchTerm || undefined, this.globalSearch).subscribe({
      next: (res) => {
        this.customers = res?.data ?? [];
        this.loading = false;
      },
      error: () => {
        this.message = 'Unable to load customers.';
        this.loading = false;
      }
    });
  }

  searchCustomers(): void {
    this.loadCustomers();
  }

  toggleGlobalSearch(): void {
    this.globalSearch = !this.globalSearch;
    this.loadCustomers();
  }

  editCustomer(customer: any): void {
    this.editingCustomerId = customer.id;
    this.editForm = { ...customer };
  }

  cancelEdit(): void {
    this.editingCustomerId = null;
    this.editForm = null;
  }

  saveCustomer(): void {
    if (!this.editForm || this.editingCustomerId == null) return;

    this.customerService.updateCustomer(this.editingCustomerId, this.editForm).subscribe({
      next: (res) => {
        this.message = res?.message ?? 'Customer updated successfully.';
        this.loadCustomers();
        this.cancelEdit();
      },
      error: () => {
        this.message = 'Unable to update customer.';
      }
    });
  }

  deleteCustomer(customer: any): void {
    if (!confirm(`Delete ${customer.name}?`)) return;

    this.customerService.deleteCustomer(customer.id).subscribe({
      next: (res) => {
        this.message = res?.message ?? 'Customer deleted successfully.';
        this.loadCustomers();
      },
      error: () => {
        this.message = 'Unable to delete customer.';
      }
    });
  }
}
