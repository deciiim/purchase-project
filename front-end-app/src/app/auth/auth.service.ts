import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

interface JwtPayload {
  sub: number;
  email: string;
  role: string;
  name: string;  // matches your backend "name"
  iat: number;
  exp: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'auth_token';
  private readonly apiUrl = 'http://localhost:3000';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(email: string, password: string): Observable<{ access_token: string }> {
    return this.http.post<{ access_token: string }>(
      `${this.apiUrl}/auth/login`,
      { email, password }
    );
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Manual JWT decode without jwt-decode package
  private decodeJwt(token: string): any | null {
    try {
      const payloadBase64 = token.split('.')[1];
      // Fix base64url encoding
      const base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
      // Decode base64
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Failed to decode JWT:', error);
      return null;
    }
  }

  getCurrentUser(): JwtPayload | null {
    const token = this.getToken();
    if (!token) {
      console.log('No token found in localStorage');
      return null;
    }

    const decoded = this.decodeJwt(token);
    if (!decoded) return null;

    console.log('Decoded JWT payload:', decoded);
    return decoded as JwtPayload;
  }
}
