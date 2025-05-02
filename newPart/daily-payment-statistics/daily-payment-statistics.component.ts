import { Component, OnInit } from '@angular/core';
import { DailyPaymentStatisticsService, DailyPaymentStatistics } from 'src/app/services/daily-payment-statistics.service';
import { ApexChart, ApexNonAxisChartSeries, ApexResponsive, ApexTitleSubtitle } from 'ng-apexcharts';

export type ChartOptions = {
  series: any[];  // Série des données, de type tableau d'objets
  chart: ApexChart;
  labels: string[];
  responsive: ApexResponsive[];
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-daily-payment-statistics',
  templateUrl: './daily-payment-statistics.component.html',
  styleUrls: ['./daily-payment-statistics.component.css']
})
export class DailyPaymentStatisticsComponent implements OnInit {

  statistics: DailyPaymentStatistics[] = [];
  chartOptions: ChartOptions = {
    series: [],  // Tableau de séries de données
    chart: {
      type: 'line',  // Graphique linéaire
      height: 350
    },
    labels: [],  // Labels des dates
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 300
          },
          legend: {
            position: 'bottom'
          }
        }
      }
    ],
    title: {
      text: 'Total Payment Trend for the Last 2 Days'  // Titre du graphique
    }
  };

  isChartLoading: boolean = false;

  constructor(private statisticsService: DailyPaymentStatisticsService) {}

  ngOnInit(): void {
    this.loadDailyStatistics();
  }

  private loadDailyStatistics(): void {
    this.statisticsService.getAllStatistics().subscribe({
      next: (data: DailyPaymentStatistics[]) => {
        this.statistics = data;

        // Sélectionner les statistiques des deux derniers jours
        const lastTwoDaysStats = data.slice(-2); // Derniers 2 jours

        // Préparer les données du graphique
        this.chartOptions.series = [
          {
            name: 'Total Payments',
            data: lastTwoDaysStats.map(stat => stat.totalAmount)
          }
        ];

        // Préparer les labels pour les dates des derniers jours
        this.chartOptions.labels = lastTwoDaysStats.map(stat => new Date(stat.date).toLocaleDateString());

        this.isChartLoading = false;
      },
      error: (err) => {
        console.error('Error fetching daily payment statistics:', err);
      }
    });
  }

  archivePayment(stat: DailyPaymentStatistics): void {
    console.log('Archiving payment:', stat);
    this.statisticsService.archivePayment(stat.id).subscribe({
      next: () => {
        console.log(`Payment with ID ${stat.id} has been archived.`);
        this.loadDailyStatistics();  // Recharger les statistiques après l'archivage
      },
      error: (err) => {
        console.error('Error archiving payment:', err);
      }
    });
  }

  deletePayment(id: number): void {
    if (confirm('Are you sure you want to delete this payment?')) {
      console.log('Deleting payment with ID:', id);
      this.statisticsService.deletePayment(id).subscribe({
        next: () => {
          console.log(`Payment with ID ${id} has been deleted.`);
          this.loadDailyStatistics();  // Recharger les statistiques après la suppression
        },
        error: (err) => {
          console.error('Error deleting payment:', err);
        }
      });
    }
  }
}
