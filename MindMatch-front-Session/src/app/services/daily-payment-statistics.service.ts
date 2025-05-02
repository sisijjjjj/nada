import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DailyPaymentStatistics {
  id: number;
  date: Date;
  numberOfPayments: number;
  totalAmount: number;
}

@Injectable({
  providedIn: 'root'
})
export class DailyPaymentStatisticsService {

  private apiUrl = 'http://localhost:8088/api/statistics'; // Adapte l'URL si besoin

  constructor(private http: HttpClient) { }

  // Récupérer toutes les statistiques
  getAllStatistics(): Observable<DailyPaymentStatistics[]> {
    return this.http.get<DailyPaymentStatistics[]>(`${this.apiUrl}/all`);
  }

  // Ajouter une statistique manuellement (optionnel)
  addStatistic(stat: DailyPaymentStatistics): Observable<DailyPaymentStatistics> {
    return this.http.post<DailyPaymentStatistics>(`${this.apiUrl}/add`, stat);
  }

 // Supprimer un paiement
 deletePayment(id: number): Observable<void> {
  return this.http.delete<void>(`${this.apiUrl}/${id}`);
}

// Archiver un paiement
archivePayment(id: number): Observable<void> {
  return this.http.put<void>(`${this.apiUrl}/archive/${id}`, {});
}

  
}
