import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private readonly apiUrl = 'https://clientverifierapi.onrender.com/api/Customer';

  constructor(private http: HttpClient) {}

  addCustomer(customer: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, { ...customer });
  }

  getCustomers(query?: string, globalSearch = false): Observable<any> {
    const params: any = {};
    if (query) {
      params.query = query;
    }
    if (globalSearch) {
      params.global = true;
    }
    return this.http.get(`${this.apiUrl}`, { params });
  }

  updateCustomer(id: number, customer: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, customer);
  }

  deleteCustomer(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
