import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from 'src/app/services/payment.service';
import { AuthService } from 'src/app/services/auth.service';
import { Session } from 'src/app/models/session.model';

@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.css'],
})
export class PaymentSuccessComponent implements OnInit {
  isLoading: boolean = true;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private paymentService: PaymentService,
    private authService: AuthService
  ) {}

  // Angular example
  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const sessionId = params['session_id'];
      const validTitles = this.getValidSessionTitles();
      if (sessionId) {
        this.paymentService.getSession(sessionId, validTitles).subscribe(() => {
          this.isLoading = false;
          this.removeReservedSessions();
          setTimeout(() => {
            this.router.navigate(['my-payments']);
          }, 3000);
        });
      }
    });
  }

  private getValidSessionTitles(): string[] {
    const saved = localStorage.getItem('reservedSessions');
    const userId = this.authService.getUserId();

    if (!saved || !userId) return [];

    const allReserved: Session[] = JSON.parse(saved);
    const now = new Date();
    const validTitles: string[] = [];

    allReserved.forEach((session) => {
      const reservation = session.reservations.find((r) => r.userId === userId);
      if (reservation) {
        const diffDays =
          (now.getTime() - new Date(reservation.createdAt).getTime()) /
          (1000 * 3600 * 24);
        if (diffDays <= 3) {
          validTitles.push(session.title);
        }
      }
    });

    return validTitles;
  }

  removeReservedSessions(): void {
    const saved = localStorage.getItem('reservedSessions');
    const userId = this.authService.getUserId();

    if (saved && userId) {
      const allReserved: Session[] = JSON.parse(saved);

      const updated = allReserved
        .map((session) => {
          session.reservations = session.reservations.filter(
            (r) => r.userId !== userId
          );
          return session;
        })
        .filter((session) => session.reservations.length > 0);

      localStorage.setItem('reservedSessions', JSON.stringify(updated));
    }
  }
}
