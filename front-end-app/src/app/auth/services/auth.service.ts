// FILE: src/app/auth/services/auth.service.ts

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment'; // Make sure this path is correct
import { jwtDecode } from 'jwt-decode'; // <-- 1. UPDATED IMPORT SYNTAX
import { Observable } from 'rxjs';

// This interface now correctly matches your backend token payload
interface JwtPayload {
  email?: string;
  role?: string;
  name?: string; 
  sub?: number;
  iat?: number;
  exp?: number;
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

  sendPasswordResetEmail(email: string): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/auth/forgot-password`, { email });
  }

  resetPassword(token: string, password: string): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/auth/reset-password`, { token, password });
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // --- THIS METHOD IS NOW FIXED ---
  getCurrentUser(): JwtPayload | null {
    const token = this.getToken();
    if (!token) return null;
  
    try {
      // 2. UPDATED to a direct function call, which is the modern way
      const decoded: JwtPayload = jwtDecode(token);
      return decoded;
    } catch (error) {
      console.error('Invalid token:', error);
      return null;
    }
  }
}