import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreatePaymentDto } from '../models/create-payment.dto';
import { Payment, PaymentStatus } from '../models/payment.model';
import { AuthService } from './auth.service';
import { PaymentStripe } from '../models/paymentstripe.model';

@Injectable({
  providedIn: 'root',
})
export class PaymentstripeService {
  private apiUrl = 'http://localhost:8088/api/paymentStripe';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getPayments() {
    return this.http.get<PaymentStripe[]>(this.apiUrl);
  }

  getPaymentById(id: number) {
    return this.http.get<PaymentStripe>(`${this.apiUrl}/${id}`);
  }

  getPaymentsByUser(id: number) {
    return this.http.get<PaymentStripe[]>(`${this.apiUrl}/user/${id}`);
  }

  createPayment(paymentData: CreatePaymentDto, userId: number) {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.authService.getToken()}`
    );
    return this.http.post(`${this.apiUrl}/${userId}`, paymentData, { headers });
  }

  updatePayment(payment: PaymentStripe, paymentId: number) {
    return this.http.put<PaymentStripe>(`${this.apiUrl}/${paymentId}`, payment);
  }

  updatePaymentStatus(
    paymentId: number,
    status: PaymentStatus,
    userId: number
  ) {
    return this.http.put<PaymentStripe>(
      `${this.apiUrl}/${paymentId}/${status}/${userId}`,
      {}
    );
  }

  deletePayment(id: number) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  handleStripeWebhook(payload: string, sigHeader: string) {
    return this.http.post<void>(`${this.apiUrl}/stripe/webhook`, {
      payload,
      sigHeader,
    });
  }
}
