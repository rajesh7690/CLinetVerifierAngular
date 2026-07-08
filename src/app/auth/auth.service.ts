import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { JwtPayload } from '../Model/commonModel';
import { environment } from '../../environments/environment';

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
  private readonly apiUrl = `${environment.apiBaseUrl}/api/Shopkeeper`;
  private readonly currentUserNameSubject = new BehaviorSubject<string | null>(this.getStoredUserName());
  readonly currentUserName$ = this.currentUserNameSubject.asObservable();

  constructor(private http: HttpClient) { }

  register(firstName: string, lastName: string, email: string, username: string, passwordHash: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, { firstName, lastName, email, username, passwordHash });
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password });
  }

  refreshToken(): Observable<any> {
    const token = this.getAccessToken();
    const refreshToken = this.getRefreshToken();
    return this.http.post(`${this.apiUrl}/refresh`, { token, refreshToken });
  }

  setTokens(token: string, refreshToken: string) {
    localStorage.setItem('accessToken', token);
    localStorage.setItem('refreshToken', refreshToken);
    this.setUserNameFromToken(token);
  }

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  getShopkeeperName(): string | null {
    return this.currentUserNameSubject.value ?? this.getStoredUserName();
  }

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('shopkeeperName');
    localStorage.removeItem('shopkeeperId');
    this.currentUserNameSubject.next(null);
  }

  decodeToken(token?: string): JwtPayload | null {
    try {
      const jwt = token || this.getAccessToken();
      if (!jwt) return null;

      const payloadBase64 = jwt.split('.')[1];
      const payloadJson = atob(payloadBase64);
      return JSON.parse(payloadJson);
    } catch (error) {
      console.error('Failed to decode JWT', error);
      return null;
    }
  }

  private setUserNameFromToken(token: string): void {
    const payload = this.decodeToken(token);
    const parsedName = this.buildDisplayName(payload);
    const nameToStore = parsedName || 'Shopkeeper';
    localStorage.setItem('shopkeeperName', nameToStore);
    this.currentUserNameSubject.next(nameToStore);
  }

  private buildDisplayName(payload: JwtPayload | null): string {
    const firstName = payload?.firstName ?? '';
    const lastName = payload?.lastName ?? '';
    return `${firstName} ${lastName}`.trim();
  }

  private getStoredUserName(): string | null {
    return localStorage.getItem('shopkeeperName');
  }
}
