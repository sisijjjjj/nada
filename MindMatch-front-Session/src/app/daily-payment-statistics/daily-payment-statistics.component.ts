import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { PaymentStatus } from 'src/app/models/payment.model';
import { PaymentService } from 'src/app/services/payment.service';
import { AuthService } from 'src/app/services/auth.service';
import { finalize } from 'rxjs';
import jsPDF from 'jspdf';
import { PaymentDTO } from 'src/app/models/payment.dto';
import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
  ChartComponent,
  ApexTitleSubtitle,
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;

  responsive: ApexResponsive[];
  labels: string[];
  title?: ApexTitleSubtitle;
};

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
})
export class PaymentComponent implements OnInit {
  @ViewChild('chart') chart!: ChartComponent;
  payments: PaymentDTO[] = [];
  filteredPayments: PaymentDTO[] = [];
  isLoading: boolean = false;
  isChartLoading: boolean = false;
  PaymentStatus = PaymentStatus;
  // Stocker les paiements filtrés pour un participant
  participantPayments: PaymentDTO[] = [];

  searchQuery: string = '';

  public amountChart: ChartOptions = {
    series: [],
    chart: {
      type: 'polarArea',
      width: 380,
    },
    labels: [],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: 'bottom', 
          },
        },
      },
    ],
  };

  constructor(
    private paymentService: PaymentService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadPayments();
    this.loadAverageAmount();
  }

  loadPayments(): void {
    this.isLoading = true;
    this.paymentService
      .getPayments()
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (response) => {
          this.payments = response;
          this.filteredPayments = [...this.payments]; // Initialisation avec tous les paiements
        },
        error: (error) => {
          alert(error.error.message);
        },
      });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.cdr.detectChanges();
    });
  }

  loadAverageAmount(): void {
    this.isChartLoading = true;
    this.paymentService
      .averageAmount()
      .pipe(
        finalize(() => {
          this.isChartLoading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (response) => {
          this.amountChart = {
            ...this.amountChart,
            series: response.amount || [],
            labels: response.names || [],
          };
        },
        error: (error) => {
          alert(error.error.message);
        },
      });
  }

  updatePaymentStatus(id: number, status: PaymentStatus) {
    this.isLoading = true;
    const decodedToken = this.authService.getDecodedToken();
    this.paymentService
      .updatePaymentStatus(id, status, decodedToken.userId)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.loadPayments();
        })
      )
      .subscribe({
        next: () => {},
        error: (error) => {
          alert(error.error.message);
        },
      });
  }

  generatePaymentPDF(payment: PaymentDTO): void {
    const doc = new jsPDF();
    let y = 20;

    // Title
    doc.setFontSize(18);
    doc.setTextColor(76, 175, 80); // #4CAF50
    doc.text('Confirmation de Paiement', 105, y, { align: 'center' });
    
    y += 10;
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.line(20, y, 190, y);

    y += 10;
    doc.setFontSize(12);
    doc.setTextColor(0);
    const now = new Date().toLocaleString('fr-FR');

    doc.text(`Nom: ${payment?.userFirstName ?? 'Esprit'}`, 30, y);
    y += 8;
    doc.text(`Prénom: ${payment?.userLastName ?? 'Student'}`, 30, y);
    y += 8;
    doc.text(`Adresse: ${payment?.userAddress ?? 'Tunis, Tunisia'}`, 30, y);
    y += 8;
    doc.text(`Téléphone: ${payment?.userPhone ?? '+216 99 999 999'}`, 30, y);
    y += 8;
    doc.text(`Date: ${now}`, 30, y);
    y += 8;
    doc.text(`Sessions: ${payment?.titles ?? '-'}`, 30, y);
    y += 15;

    // Table Headers
    doc.setFontSize(12);
    doc.setFillColor(242, 242, 242);
    doc.rect(20, y, 170, 10, 'F');
    doc.text('Participant', 22, y + 7);
    doc.text('Amount', 70, y + 7);
    doc.text('Method', 102, y + 7);
    doc.text('Status', 132, y + 7);

    y += 16;

    // Payment Details
    const participant = payment?.userFirstName + ' ' + payment?.userLastName;
    const status = payment?.status ?? PaymentStatus.PENDING;
    const amount = payment?.amount != null ? `${payment.amount} DT` : '0.00 DT';
    const method = payment?.method ?? 'Non spécifié';

    doc.setFontSize(11);
    doc.text(participant, 22, y);
    doc.text(amount, 70, y);
    doc.text(method, 102, y);

    let color;

    switch (status) {
      case PaymentStatus.COMPLETED:
        color = [0, 255, 0];
        break;
      case PaymentStatus.CANCELLED:
        color = [255, 0, 0];
        break;
      default:
        color = [0, 0, 255];
        break;
    }
    doc.setTextColor(color[0], color[1], color[2]);
    doc.text(status, 132, y);

    doc.save('confirmation-paiement.pdf');
  }

  filterPayments() {
    if (this.searchQuery) {
      this.filteredPayments = this.payments.filter(payment =>
        payment.userFirstName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        payment.userLastName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        payment.amount.toString().includes(this.searchQuery) ||
        payment.titles.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        payment.status.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        payment.userPhone.includes(this.searchQuery)
      );
    } else {
      this.filteredPayments = [...this.payments];
    }
  }
}
