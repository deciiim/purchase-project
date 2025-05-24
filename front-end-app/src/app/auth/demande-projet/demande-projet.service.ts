import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CreateDemandeProjetDto {
  name: string;
  demandeAchatId: number;
  projetId: number;
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DemandeProjetService {
  private apiUrl = 'http://localhost:3000/demande-projets'; // Update if needed

  constructor(private http: HttpClient) {}

  createDemande(dto: CreateDemandeProjetDto): Observable<any> {
    return this.http.post(this.apiUrl, dto);
  }

  getDemandes(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
  remove(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  
}
