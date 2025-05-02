import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators'; // Ajoutez tap depuis rxjs/operators
import { Session } from 'src/_models/session.model';


@Injectable({
  providedIn: 'root'
})
export class SessionService {


    private baseUrl = 'http://localhost:8088/Session'; // 🔁 à adapter selon ton backend
  
    constructor(private http: HttpClient) {}
    private sessionsUpdated = new Subject<void>();


    getAllSessions(): Observable<Session[]> {
      return this.http.get<Session[]>(`${this.baseUrl}/allSessions`);
    }
  
    getSessionById(id: number): Observable<Session> {
      return this.http.get<Session>(`${this.baseUrl}/getSessionById/${id}`);
    }
  
    addSession(session: Session): Observable<Session> {
      return this.http.post<Session>(`${this.baseUrl}/add`, session);
    }
  
    updateSession(id: any, session: Session): Observable<any> {
      return this.http.put(`${this.baseUrl}/updateCompetition/{id}`, session);
    }
  
    deleteSession(id: number): Observable<any> {
      return this.http.delete(`${this.baseUrl}/deleteSession/${id}`);
    }

    uploadUserImages(formData: FormData , sessionId:any) {
      return this.http.post<Session>(`${this.baseUrl}/images/upload/${sessionId}`,formData);
    }

    getAllFormationsNonArchivees(): Observable<Session[]> {
      return this.http.get<Session[]>(`${this.baseUrl}/non-archivees`);
    }

    archiveSession(id: number): Observable<string> {
      return this.http.post(`${this.baseUrl}/archive/${id}`, null, { responseType: 'text' }).pipe(
        tap(() => this.sessionsUpdated.next())
      );
    }

    unarchiveSession(id: number): Observable<string> {
      return this.http.put(`${this.baseUrl}/unarchive/${id}`, null, { responseType: 'text' }).pipe(
        tap(() => this.sessionsUpdated.next())
      );
    }

    getSessionsUpdatedListener(): Observable<void> {
      return this.sessionsUpdated.asObservable();
    }

    checkExpiredSessions(): Observable<any> {
      return this.http.get(`${this.baseUrl}/check-expired`);
    }

  }