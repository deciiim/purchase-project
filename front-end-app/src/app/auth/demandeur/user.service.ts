import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private currentUser: any = null;
  private lastRoute: string = '';

  constructor() {
    // Charger l'utilisateur depuis le localStorage au démarrage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUser = JSON.parse(savedUser);
    }
  }

  getCurrentUser() {
    return this.currentUser || { username: 'Test User' };
  }

  setCurrentUser(user: any) {
    this.currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  updateUsername(username: string) {
    if (this.currentUser) {
      this.currentUser.username = username;
      localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
    } else {
      this.setCurrentUser({ username });
    }
  }

  setLastRoute(route: string) {
    this.lastRoute = route;
  }

  getLastRoute(): string {
    return this.lastRoute;
  }

  /** Clears user data from memory and localStorage */
  clearUser() {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
  }
}
