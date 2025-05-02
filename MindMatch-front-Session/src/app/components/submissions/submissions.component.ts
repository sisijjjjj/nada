import { Component, OnInit } from '@angular/core';
import { Submission, SubmissionService, submissionStatus } from 'src/app/services/submission.service';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';

@Component({
  selector: 'app-submissions',
  templateUrl: './submissions.component.html',
  styleUrls: ['./submissions.component.css']
})
export class SubmissionsComponent implements OnInit {
  submissions: Submission[] = [];
  submissionStatus = submissionStatus;
  
  statistics = {
    totalUsers: 0,
    totalSessions: 0,
    totalSubmissions: 0,
    totalDocumentsUploaded: 0,
    statusDistribution: {
      accepted: 0,
      rejected: 0,
      pending: 0
    }
  };
  statisticsVisible = false;

  // Configuration des graphiques
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        enabled: true,
        mode: 'index',
        intersect: false,
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      }
    }
  };

  public barChartType: ChartType = 'bar';
  public barChartData: ChartData<'bar'> = {
    labels: ['Utilisateurs', 'Sessions', 'Soumissions', 'Documents'],
    datasets: [
      { 
        data: [0, 0, 0, 0], 
        label: 'Statistiques globales',
        backgroundColor: [
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 99, 132, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)'
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

// Mettez à jour la configuration du pieChartOptions comme suit :
public pieChartOptions: ChartConfiguration['options'] = {
  responsive: true,
  plugins: {
    legend: {
      display: true,
      position: 'top',
    },
    tooltip: {
      enabled: true,
      callbacks: {
        label: (context) => {
          const label = context.label || '';
          const value = context.raw as number; // Conversion explicite en number
          const total = (context.dataset.data as number[]).reduce((a, b) => a + b, 0);
          const percentage = Math.round((value / total) * 100);
          return `${label}: ${value} (${percentage}%)`;
        }
      }
    }
  }
};

  public pieChartType: ChartType = 'pie';
  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: ['Acceptées', 'Rejetées', 'En attente'],
    datasets: [{
      data: [
        this.statistics.statusDistribution.accepted,
        this.statistics.statusDistribution.rejected,
        this.statistics.statusDistribution.pending
      ],
      backgroundColor: [
        'rgba(75, 192, 192, 0.7)',
        'rgba(255, 99, 132, 0.7)',
        'rgba(255, 206, 86, 0.7)'
      ],
      hoverBackgroundColor: [
        'rgba(75, 192, 192, 1)',
        'rgba(255, 99, 132, 1)',
        'rgba(255, 206, 86, 1)'
      ],
      borderWidth: 1
    }]
  };

  constructor(private submissionService: SubmissionService) {}

  ngOnInit(): void {
    this.loadSubmissions();
    this.loadStatistics();
  }

  getFileName(path: string): string {
    return path.split(/[\\/]/).pop() || 'document';
  }

  getDocumentUrl(path: string): string {
    return `${this.submissionService.getDocument}/document?filePath=${encodeURIComponent(path)}`;
  }

  loadSubmissions() {
    this.submissionService.getAllSubmissions().subscribe(data => {
      this.submissions = data;
    });
  }

  loadStatistics() {
    this.submissionService.getStatistics().subscribe({
      next: data => {
        this.statistics = {
          ...data,
          statusDistribution: this.calculateStatusDistribution(data.statusDistribution)
        };
        
        // Mise à jour des graphiques
        this.updateCharts();
      },
      error: err => {
        console.error('Error loading statistics:', err);
        this.statistics = {
          totalUsers: 0,
          totalSessions: 0,
          totalSubmissions: 0,
          totalDocumentsUploaded: 0,
          statusDistribution: {
            accepted: 0,
            rejected: 0,
            pending: 0
          }
        };
        this.updateCharts();
      }
    });
  }

  private calculateStatusDistribution(statusData: any) {
    return {
      accepted: statusData?.ACCEPTED || 0,
      rejected: statusData?.REJECTED || 0,
      pending: statusData?.PENDING || 0
    };
  }

  private updateCharts() {
    // Mise à jour du graphique en barres
    this.barChartData = {
      ...this.barChartData,
      datasets: [{
        ...this.barChartData.datasets[0],
        data: [
          this.statistics.totalUsers,
          this.statistics.totalSessions,
          this.statistics.totalSubmissions,
          this.statistics.totalDocumentsUploaded
        ] as number[] // Conversion explicite
      }]
    };
  
    // Mise à jour du graphique circulaire
    this.pieChartData = {
      ...this.pieChartData,
      datasets: [{
        ...this.pieChartData.datasets[0],
        data: [
          this.statistics.statusDistribution.accepted,
          this.statistics.statusDistribution.rejected,
          this.statistics.statusDistribution.pending
        ] as number[] // Conversion explicite
      }]
    };
  }

  toggleStatisticsVisibility() {
    this.statisticsVisible = !this.statisticsVisible;
  }

  updateStatus(id: number, status: submissionStatus) {
    this.submissionService.updateSubmissionStatus(id, status).subscribe(() => {
      this.loadSubmissions();
      this.loadStatistics(); // Recharger les stats après modification
    });
  }

  getStatusColor(status: submissionStatus): string {
    switch (status) {
      case submissionStatus.ACCEPTED: return 'accepted';
      case submissionStatus.REJECTED: return 'rejected';
      default: return 'pending';
    }
  }

  previewDocument(filePath: string) {
    const url = this.getDocumentUrl(filePath);
    window.open(url, '_blank');
  }

  downloadDocument(filePath: string) {
    this.submissionService.getDocument(filePath).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = this.getFileName(filePath);
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
}