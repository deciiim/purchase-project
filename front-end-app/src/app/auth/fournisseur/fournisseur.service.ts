import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FournisseurService {
  private readonly BASE_URL = 'http://localhost:3000/fournisseurs';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('User is not authenticated. Token is missing.');
    }
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  addFournisseur(fournisseur: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(this.BASE_URL, fournisseur, { headers });
  }

  findAll(): Observable<any[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<any[]>(this.BASE_URL, { headers });
  }

  findOne(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get<any>(`${this.BASE_URL}/${id}`, { headers });
  }

  update(id: number, fournisseur: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.patch(`${this.BASE_URL}/${id}`, fournisseur, { headers });
  }

  remove(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.BASE_URL}/${id}`, { headers });
  }
}
