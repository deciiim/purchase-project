import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateBCDto } from './bc.models';

@Injectable({
  providedIn: 'root',
})
export class BcService {
  private apiUrl = 'http://localhost:3000/bon-commande'; // adjust your backend URL

  constructor(private http: HttpClient) {}

  createBC(data: CreateBCDto): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  getAllBCs(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getBCById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  updateBC(id: string, data: Partial<CreateBCDto>): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}`, data);
  }

  deleteBC(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
