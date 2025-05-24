import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DirectorGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const userRole = localStorage.getItem('userRole');
    console.log('DirectorGuard - User Role:', userRole);
    
    if (userRole === 'directeur') {
      console.log('DirectorGuard - Access granted');
      return true;
    }
    
    console.log('DirectorGuard - Access denied, redirecting to login');
    this.router.navigate(['/login']);
    return false;
  }
} 