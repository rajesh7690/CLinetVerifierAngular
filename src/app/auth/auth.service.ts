import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtPayload } from '../Model/commonModel';

interface AuthResponse {
  success: boolean;
  token?: string;
  refreshToken?: string;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:44354/api/Shopkeeper'; // your .NET API

  constructor(private http: HttpClient) { }

  register(firstName: string, lastName: string, email: string,username:string, passwordHash: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, { firstName, lastName, email,username, passwordHash });
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password });
  }

  refreshToken(): Observable<any> {
    const Token = this.getAccessToken();
    const refreshToken = this.getRefreshToken();
    return this.http.post(`${this.apiUrl}/refresh`, { Token, refreshToken });
  }

  // store token in localStorage/sessionStorage
  setTokens(token: string, refreshToken: string) {
    localStorage.setItem('accessToken', token);
    localStorage.setItem('refreshToken', refreshToken);
  }

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  decodeToken(token?: string): JwtPayload | null {
    try {
      const jwt = token || this.getAccessToken();
      if (!jwt) return null;

      const payloadBase64 = jwt.split('.')[1]; // header.payload.signature
      const payloadJson = atob(payloadBase64);
      return JSON.parse(payloadJson);
    } catch (error) {
      console.error('Failed to decode JWT', error);
      return null;
    }
  }

}
