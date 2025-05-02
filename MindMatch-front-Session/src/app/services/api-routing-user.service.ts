import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ApiRoutingUserService {

  private apiUrl = 'http://localhost:8088/api/v1/users';

  constructor(private http: HttpClient) { }

  requestApi(urlPath: string, body: any, params?: HttpParams): Observable<any> {
    return this.http.post<any>(
      this.apiUrl + urlPath,
      body, 
      {
        params: params,
        responseType: 'json'
      }
    );
  }
  requestGetApi(urlPath: string, params?: HttpParams): Observable<any> {
    return this.http.get<any>(
      this.apiUrl + urlPath,
      {
        params: params,
        responseType: 'json'
      }
    );
}
}
