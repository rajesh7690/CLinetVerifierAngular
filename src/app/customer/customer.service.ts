import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private apiUrl = 'https://localhost:44354/api/Customer'; // 🔗 your API base URL

  constructor(private http: HttpClient) {}

  addCustomer(customer: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, {...customer});
  }
}
