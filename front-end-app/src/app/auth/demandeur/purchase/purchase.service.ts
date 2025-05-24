import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Purchase {
  requestNumber: string;    // Assuming backend sends an ID or you use 'id' below
  qte: number;             // mapped from 'quantite'
  details: string;         // mapped from 'description'
  date: Date;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  username?: string;
}

export interface PurchaseResponse {
  data: any[];     // raw data array from backend
  meta: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {
  private apiUrl = 'http://localhost:3000/demande-achat'; // Backend API URL

  constructor(private http: HttpClient) {}

  // Fetch paginated purchase requests
  getAllPurchases(page: number = 1, limit: number = 10): Observable<PurchaseResponse> {
    return this.http.get<PurchaseResponse>(`${this.apiUrl}?page=${page}&limit=${limit}`);
  }

  // Delete a purchase request by its ID
  deletePurchase(id: string | number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }createPurchase(purchaseData: any): Observable<any> {
    return this.http.post(this.apiUrl, purchaseData);
  }
  // Fetch purchase statistics
getPurchaseStats(): Observable<any> {
    const token = localStorage.getItem('auth_token');
    const headers = {
      Authorization: `Bearer ${token}`
    };
  
    return this.http.get<any>(`${this.apiUrl}/stats`, { headers });
  }
  // In PurchaseService (add only these two methods)

  updatePurchaseStatus(id: string | number, status: 'PENDING' | 'APPROVED' | 'REJECTED'): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/status`, { status });
  }
  

}

