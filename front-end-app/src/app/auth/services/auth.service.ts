import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import * as jwt_decode from 'jwt-decode';

import { Observable } from 'rxjs';

interface JwtPayload {
  email?: string;
  role?: string;
  username?: string;   // Add username here
  // other fields if needed
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'auth_token';

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  login(email: string, password: string): Observable<{ access_token: string }> {
    return this.http.post<{ access_token: string }>(
      `${environment.apiUrl}/auth/login`,
      { email, password }
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getCurrentUser(): JwtPayload | null {
    const token = this.getToken();
    if (!token) return null;
  
    try {
      const decoded = (jwt_decode as any).default(token);
  
      return {
        email: decoded.email || '',
        role: decoded.role || '',
        username: decoded.username || decoded.name || decoded.email || ''  // fallback order
      };
    } catch (error) {
      console.error('Invalid token:', error);
      return null;
    }
  }
  

  sendPasswordResetEmail(email: string): Observable<void> {
    return this.http.post<void>(
      `${environment.apiUrl}/auth/reset-password`,
      { email }
    );
  }
}
