import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class DirecteurUserService {
  private currentUserSubject = new BehaviorSubject<any>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  private readonly STORAGE_KEY = 'directeur_user';
  private readonly API_URL = 'http://localhost:3000';
  private readonly DEFAULT_ROLE = 'Directeur';

  constructor(private http: HttpClient) {
    this.loadUser();
  }

  private loadUser() {
    const savedUser = localStorage.getItem(this.STORAGE_KEY);
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  private saveUser(user: any) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
  }

  getCurrentUser() {
    return this.currentUserSubject.value;
  }

  updateUser(user: any) {
    const updatedUser = {
      ...user,
      role: this.DEFAULT_ROLE
    };
    this.currentUserSubject.next(updatedUser);
    this.saveUser(updatedUser);
  }

  fetchUserProfile() {
    const token = localStorage.getItem('auth_token');
    if (!token) return of(null);

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get(`${this.API_URL}/users/me`, { headers }).pipe(
      tap((user: any) => {
        this.updateUser(user);
      }),
      catchError(err => {
        console.error('[DirecteurUserService] Erreur de profil :', err);
        return of(null);
      })
    );
  }

  setLastRoute(route: string) {
    localStorage.setItem('directeur_last_route', route);
  }

  getLastRoute(): string {
    return localStorage.getItem('directeur_last_route') || '';
  }
}
