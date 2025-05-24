import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Project } from '../../models/project.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = 'http://localhost:3000/projet';

  constructor(private http: HttpClient) {}

  private getAuthHeaders() {
    const token = localStorage.getItem('auth_token');
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      })
    };
  }

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.apiUrl, this.getAuthHeaders());
  }

  getProject(id: number): Observable<Project> {
    return this.http.get<Project>(`${this.apiUrl}/${id}`, this.getAuthHeaders());
  }

  createProject(project: Project): Observable<Project> {
    return this.http.post<Project>(this.apiUrl, project, this.getAuthHeaders());
  }

  updateProject(id: number, project: Partial<Project>): Observable<Project> {
    return this.http.patch<Project>(`${this.apiUrl}/${id}`, project, this.getAuthHeaders());
  }

  deleteProject(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.getAuthHeaders());
  }
}
