import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CustomerService } from '../customer.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-add-customer',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.css']
})
export class AddCustomerComponent {
  customerForm: FormGroup;
  message = '';

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router,private _customerService: CustomerService) {
    this.customerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      adharNumber: ['', [Validators.required, Validators.minLength(12), Validators.maxLength(12)]],
      pendingBalance: [0, [Validators.required, Validators.min(1)]]
    });
  }

  async submit() {
    if (this.customerForm.invalid) return;
    await lastValueFrom (this._customerService.addCustomer(this.customerForm.value));
    
  }
}
