import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';
@Injectable({
  providedIn: 'root'
})


export class AuthGuard implements CanActivate {

  
  constructor(private auth: AuthService, private router: Router) { }

  canActivate(): boolean {
    const token = this.auth.getAccessToken();
    if (token) {
      const decoded = this.parseJwt(token);
      const expiry = decoded.exp * 1000; // exp is in seconds
      if (Date.now() < expiry) {
        return true;
      } else {
        this.auth.logout();
        this.router.navigate(['/login']);
        return false;
      }
    }
    this.router.navigate(['/login']);
    return false;
  }
  parseJwt(token: string) {
    const payload = token.split('.')[1];           // JWT format: header.payload.signature
    return JSON.parse(atob(payload));
  }
}


interface JwtPayload {
  id: string;
  firstName: string;
  exp: number;
  jti: string;
}