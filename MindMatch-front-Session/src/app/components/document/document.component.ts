import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { SessionService } from 'src/app/services/session.service';
import { SubmissionService } from 'src/app/services/submission.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.css']
})
export class DocumentComponent {
  diplomaFilesSelected: File[] = [];
  fileName: string = '';
  currentSessionId: number | null = null;
  availableSessions: any[] = []; // Pour stocker les sessions disponibles


  constructor(
    private authService: AuthService, 
    private router: Router, 
    private submissionService: SubmissionService,
    private sessionService: SessionService
  ) {}

  ngOnInit(): void {
    this.loadAvailableSessions();
  }

  loadAvailableSessions(): void {
    this.sessionService.getAllFormationsNonArchivees().subscribe({
      next: (sessions) => {
        this.availableSessions = sessions;
        if (this.availableSessions.length > 0) {
          this.currentSessionId = this.availableSessions[0].id;
        }
      },
      error: (error) => {
        console.error('Erreur lors du chargement des sessions:', error);
        Swal.fire({
          title: 'Erreur',
          text: 'Impossible de charger les sessions disponibles',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    });
  }

  onFileSelected(event: any, type: string): void {
    const files: FileList = event.target.files;
    const fileArray: File[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (this.isValidFileType(file)) {
        fileArray.push(file);
      } else {
        Swal.fire({
          title: 'Format invalide',
          text: 'Veuillez sélectionner uniquement des fichiers PDF ou des images (JPG, PNG, JPEG, etc.).',
          icon: 'warning',
          confirmButtonText: 'Compris',
          confirmButtonColor: '#6c63ff',
          background: '#fff8f0',
          showClass: {
            popup: 'animate__animated animate__fadeInDown'
          },
          hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
          }
        });
        event.target.value = '';
        return;
      }
    }

    if (type === 'diploma') {
      this.diplomaFilesSelected = [...this.diplomaFilesSelected, ...fileArray];
    } 

    event.target.value = '';
  }

  isValidFileType(file: File): boolean {
    const allowedTypes = [
      'application/pdf',
      'image/png',
      'image/jpeg',
      'image/jpg',
      'image/webp',
      'image/gif',
      'image/bmp',
      'image/svg+xml'
    ];
    return allowedTypes.includes(file.type);
  }

  submitDocuments(): void {
    const userId = this.authService.getUserId();
    
    if (!userId) {
      Swal.fire({
        title: 'Erreur',
        text: 'Vous devez être connecté pour soumettre des documents.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }

    if (!this.currentSessionId) {
      Swal.fire({
        title: 'Session non sélectionnée',
        text: 'Veuillez sélectionner une session avant de soumettre.',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      return;
    }

    // Vérification supplémentaire que la session existe dans la liste
    const selectedSession = this.availableSessions.find(s => s.id === this.currentSessionId);
    if (!selectedSession) {
      Swal.fire({
        title: 'Session invalide',
        text: 'La session sélectionnée n\'existe pas.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }

    if (this.diplomaFilesSelected.length === 0) {
      Swal.fire({
        title: 'Aucun fichier sélectionné',
        text: 'Veuillez sélectionner au moins un fichier à soumettre.',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      return;
    }

    const fileToUpload = this.diplomaFilesSelected[0];
    
    console.log('Tentative de soumission avec:', {
      userId: userId,
      sessionId: this.currentSessionId,
      fileName: fileToUpload.name,
      sessionExists: !!selectedSession
    });

    this.submissionService.createSubmissionWithDocument(userId, this.currentSessionId, fileToUpload)
      .subscribe({
        next: (response) => {
          Swal.fire({
            title: 'Succès!',
            text: 'Votre CV a été soumis avec succès à la session: ' + selectedSession.nom,
            icon: 'success',
            confirmButtonText: 'OK'
          }).then(() => {
            this.closePopupAndNavigate();
          });
        },
        error: (error) => {
          console.error('Erreur complète:', error);
          Swal.fire({
            title: 'Erreur',
            text: 'Échec de la soumission: ' + 
                  (error.error?.message || error.message || 'Erreur inconnue'),
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      });
  }

  closePopupAndNavigate() {
    this.router.navigate(['/sessionUser']); 
  }
}