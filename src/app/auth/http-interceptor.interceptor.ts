import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

@Injectable()
export class HttpInterceptorInterceptor implements HttpInterceptor {

  constructor(private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (this.isOpenUrl(request)) {
      return next.handle(request);
    }

    const token = localStorage.getItem('token');
    
    if (!token) {
      localStorage.clear();
      this.router.navigate(['/login']);
      return throwError(() => new Error('No token found'));
    }

    try {
      const decodedToken: any = jwtDecode(token);
      const tokenExpired = decodedToken.exp < (Date.now() / 1000);
      if (tokenExpired) {
        localStorage.clear();
        this.router.navigate(['/login']);
        return throwError(() => new Error('Token expired'));
      }
    } catch (error) {
      console.error('Error decoding token:', error);
      localStorage.clear();
      this.router.navigate(['/login']);
      return throwError(() => new Error('Token decode error'));
    }

    request = request.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });

    return next.handle(request).pipe(
      catchError(err => {
        if (err.status === 401) {
          localStorage.clear();
          this.router.navigate(['/login']);
        }
        return throwError(() => err);
      })
    );
  }

  isOpenUrl(request: HttpRequest<any>): boolean {
    return request.url.includes("/api/login");
  }
}
