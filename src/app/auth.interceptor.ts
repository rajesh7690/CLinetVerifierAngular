import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const routes = inject(Router);
  const token = authService.getAccessToken();

  // Add token to request
  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // If 401 (token expired)
      if (error.status === 401 && !req.url.includes('refresh')) {
        const refreshToken = authService.getRefreshToken();
        if (refreshToken) {
          // 🔁 Call refresh endpoint
          return authService.refreshToken().pipe(
            switchMap((newTokens: any) => {
              authService.setTokens(newTokens.accessToken, newTokens.refreshToken);
              // Retry original request with new token
              const cloned = req.clone({
                setHeaders: { Authorization: `Bearer ${newTokens.accessToken}` }
              });
              return next(cloned);
            }),
            catchError(err => {
              authService.logout(); // if refresh fails
              routes.navigate(['/login']); // navigate to login
              return throwError(() => err);
            })
          );
        }
      }
      return throwError(() => error);
    })
  );
};
