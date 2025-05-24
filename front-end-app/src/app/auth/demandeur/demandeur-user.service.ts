import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DemandeurUserService {
  private currentUserSubject = new BehaviorSubject<any>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  private lastRoute: string = '';
  private readonly STORAGE_KEY = 'demandeur_user';
  private readonly DEFAULT_ROLE = 'Demandeur';
  private readonly API_URL = 'http://localhost:3000'; // Adjust backend URL if needed

  constructor(private http: HttpClient) {
    this.loadUser();
  }

  // Load user from backend (with fallback to default)
  private loadUser() {
    this.fetchCurrentUserFromBackend().subscribe(user => {
      if (!user) {
        const defaultUser = {
          name: 'Demandeur',
          role: this.DEFAULT_ROLE,
          email: '',
          phone: '',
          department: ''
        };
        this.currentUserSubject.next(defaultUser);
        this.saveUser(defaultUser);
      }
    });
  }

  // Fetch user from /users/me using JWT token
  fetchCurrentUserFromBackend(): Observable<any> {
    const token = localStorage.getItem('auth_token');
    if (!token) return of(null);

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get(`${this.API_URL}/users/me`, { headers }).pipe(
      tap(user => {
        console.log('[DemandeurUserService] Loaded user from backend:', user);
        this.currentUserSubject.next(user);
        this.saveUser(user);
      }),
      catchError(err => {
        console.error('[DemandeurUserService] Error fetching user:', err);
        return of(null);
      })
    );
  }

  // Save user to localStorage
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
      role: this.DEFAULT_ROLE
    };
    this.currentUserSubject.next(updatedUser);
    this.saveUser(updatedUser);
  }

  updateUsername(name: string) {
    const user = this.getCurrentUser();
    user.name = name;
    this.currentUserSubject.next(user);
    this.saveUser(user);
  }

  clearUser() {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem('auth_token');
    this.currentUserSubject.next(null);
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

  // Submit Demande d'Achat with JWT token
  submitDemandeAchat(data: any): Observable<any> {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('Token JWT manquant');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.post(`${this.API_URL}/demande-achat`, data, { headers });
  }

}
