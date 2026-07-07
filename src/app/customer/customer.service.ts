import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private readonly apiUrl = 'https://localhost:7114/api/Customer';

  constructor(private http: HttpClient) {}

  addCustomer(customer: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, { ...customer });
  }

  getCustomers(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }

  updateCustomer(id: number, customer: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, customer);
  }

  deleteCustomer(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
