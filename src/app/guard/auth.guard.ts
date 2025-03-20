import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot, 
    state: RouterStateSnapshot
  ): boolean {
    const token = localStorage.getItem('token');
    if (!token) {
          localStorage.clear();
          this.router.navigate(['/login']);
          return false;
    }
    else{
      try {
        const decodedToken: any = jwtDecode(token);
        const tokenExpired = decodedToken.exp < (Date.now() / 1000);
        if (!tokenExpired) {
          return true;
        }
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
    localStorage.clear();
    this.router.navigate(['/login']);
    return false;
  }
}
