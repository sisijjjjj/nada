import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Payment, PaymentStatus } from '../models/payment.model';
import { CreatePaymentDto } from '../models/create-payment.dto';
// <-- assure-toi que ce fichier existe
import { AuthService } from 'src/app/services/auth.service';
import { catchError, throwError, Observable } from 'rxjs';
import { PaymentDTO } from 'src/app/models/payment.dto'; // <-- assure-toi que ce fichier existe

interface CheckoutResponse {
  url: string;
}

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private apiUrl = 'http://localhost:8088/api/payment';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getPayments() {
    return this.http.get<PaymentDTO[]>(this.apiUrl);
  }

  averageAmount() {
    return this.http.get<any>(`${this.apiUrl}/averageAmount`);
  }

  getPaymentById(id: number) {
    return this.http.get<Payment>(`${this.apiUrl}/${id}`);
  }

  getPaymentsByUser(id: number) {
    return this.http.get<Payment[]>(`${this.apiUrl}/user/${id}`);
  }

  createPayment(paymentData: CreatePaymentDto, userId: number) {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.authService.getToken()}`
    );
    return this.http.post(`${this.apiUrl}/${userId}`, paymentData, { headers });
  }

  updatePayment(payment: Payment, paymentId: number) {
    return this.http.put<Payment>(`${this.apiUrl}/${paymentId}`, payment);
  }

  updatePaymentStatus(
    paymentId: number,
    status: PaymentStatus,
    userId: number
  ) {
    return this.http.put<Payment>(
      `${this.apiUrl}/${paymentId}/${status}/${userId}`,
      {}
    );
  }

  deletePayment(id: number) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  createCheckoutSession(amount: number) {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.authService.getToken()}`
    );
    return this.http
      .post<{ url: string }>(
        `${this.apiUrl}/create-checkout-session`,
        {
          amount,
          currency: 'usd',
          description: 'Formation payment',
          email: this.authService.getEmail(),
        },
        { headers }
      )
      .pipe(
        catchError((err) => {
          console.error('Checkout session failed', err);
          return throwError(() => err);
        })
      );
  }

  getPaymentDetails(paymentIntent: number): Observable<PaymentDTO> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.authService.getToken()}`
    );
    return this.http.get<PaymentDTO>(
      `${this.apiUrl}/details/${paymentIntent}`,
      { headers }
    );
  }
  getSession(sessionId: string, validTitles: string[]): Observable<any> {
    return this.http.post<any>(
      `${
        this.apiUrl
      }/checkout-session/${sessionId}/${this.authService.getUserId()}`,
      validTitles
    );
  }

  reservationCancelation(userId: number, sessions: string[]) {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.authService.getToken()}`
    );
    return this.http.post<void>(
      `${this.apiUrl}/cancel-reservation/${userId}`,
      sessions,
      { headers }
    );
  }
}
