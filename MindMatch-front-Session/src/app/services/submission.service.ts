import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Session } from 'src/_models/session.model';
import { User } from 'src/_models/User.model';



export interface Submission {
  id?: number;  // ID de la soumission
  documentPaths: string[];  // Liste des chemins vers les fichiers
  submissionDate: Date;  // Date de la soumission
  user: User;  // L'utilisateur associé à la soumission
  session: Session;  // La session à laquelle la soumission est associée
  status: submissionStatus;  // Statut de la soumission
}

// Statut de la soumission
export enum submissionStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED'
}

export interface Statistics {
  totalUsers: number;
  totalSessions: number;
  totalSubmissions: number;
  totalDocumentsUploaded: number;
}

@Injectable({
  providedIn: 'root'
})
export class SubmissionService {

  private apiUrl = 'http://localhost:8088/api/submissions';
  private statsUrl = 'http://localhost:8088/api/statistics'; 



  constructor(private http: HttpClient) { }

  getStatistics(): Observable<any> {
    return this.http.get<any>(this.statsUrl);
  }

    // 📤 Submit CV with file
    createSubmissionWithDocument(userId: number, sessionId: number, file: File): Observable<Submission> {
      const formData = new FormData();
      formData.append('userId', userId.toString());
      formData.append('sessionId', sessionId.toString());
      formData.append('document', file, file.name);  // Important d'ajouter le nom du fichier ici
    
      return this.http.post<Submission>(`${this.apiUrl}/submit`, formData);
    }
    
  
    // 📥 Get all submissions
    getAllSubmissions(): Observable<Submission[]> {
      return this.http.get<Submission[]>(this.apiUrl);
    }
  
    // 📥 Get submissions by session ID
    getSubmissionsBySession(sessionId: number): Observable<Submission[]> {
      return this.http.get<Submission[]>(`${this.apiUrl}/bySession/${sessionId}`);
    }
  
    // 📥 Get submissions by user ID
    getSubmissionsByUser(userId: number): Observable<Submission[]> {
      return this.http.get<Submission[]>(`${this.apiUrl}/byUser/${userId}`);
    }
  
    // ✅ Update status
    updateSubmissionStatus(submissionId: number, status: string): Observable<Submission> {
      const params = new HttpParams().set('status', status);
      return this.http.put<Submission>(`${this.apiUrl}/${submissionId}/status`, null, { params });
    }

    getDocument(filePath: string): Observable<Blob> {
      return this.http.get(`${this.apiUrl}/document?filePath=${encodeURIComponent(filePath)}`, {
        responseType: 'blob'
      });
    }
    
    getDocumentUrl(filePath: string): string {
      return `${this.apiUrl}/document?filePath=${encodeURIComponent(filePath)}`;
    }
}
