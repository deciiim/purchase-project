import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable()
export class ResponsableUserService {
  private currentUserSubject = new BehaviorSubject<any>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  private lastRoute: string = '';
  private readonly STORAGE_KEY = 'responsable_user';
  private readonly DEFAULT_ROLE = 'Responsable';

  private readonly API_URL = 'http://localhost:3000'; // Your backend base URL

  constructor(private http: HttpClient) {
    this.loadUser();
  }

  private loadUser() {
    const savedUser = localStorage.getItem(this.STORAGE_KEY);
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    } else {
      // Set default user
      const defaultUser = {
        name: 'Responsable',
        role: this.DEFAULT_ROLE,
        email: '',
        phone: '',
        department: ''
      };
      this.currentUserSubject.next(defaultUser);
      this.saveUser(defaultUser);
    }
  }

  private saveUser(user: any) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
  }

  getCurrentUser() {
    return this.currentUserSubject.value;
  }

  updateUser(userData: any) {
    const updatedUser = {
      ...this.getCurrentUser(),
      ...userData,
      role: this.DEFAULT_ROLE // Always keep role as Responsable
    };
    this.currentUserSubject.next(updatedUser);
    this.saveUser(updatedUser);
  }

  getRole() {
    return this.DEFAULT_ROLE;
  }

  setLastRoute(route: string) {
    this.lastRoute = route;
  }

  getLastRoute(): string {
    return this.lastRoute;
  }

  // Fetch current user from backend using JWT Bearer token
  fetchUserProfile(): Observable<any> {
    const token = localStorage.getItem('auth_token'); // Make sure this matches your token key
    if (!token) return of(null);

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get(`${this.API_URL}/users/me`, { headers }).pipe(
      tap(user => {
        this.currentUserSubject.next(user);
        this.saveUser(user);
      }),
      catchError(err => {
        console.error('[ResponsableUserService] Error fetching profile:', err);
        return of(null);
      })
    );
  }
}
