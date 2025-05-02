import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserJsonService {

  private apiUrl = 'http://localhost:8088';
  constructor(private http: HttpClient) { }

  requestApi(urlPath: string, body: any, params?: HttpParams): Observable<any> {
    return this.http.post<any>(
      this.apiUrl + urlPath,
      body, 
      {
        params: params,
        responseType: 'json' // ✅ Garde la réponse au format JSON
      }
    );
  }
}