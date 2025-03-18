import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot, 
    state: RouterStateSnapshot
  ): boolean {
    const userName = localStorage.getItem('userName');
    const userId = localStorage.getItem('userId');
    if (userName && userId) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
