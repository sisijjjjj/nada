import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Role } from 'src/_models/Role.model copy';
import { User } from 'src/_models/User.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:8088/api/v1/users'; 


  constructor(private http: HttpClient) { }

    // Récupérer la liste des utilisateurs
    getAllUsers(): Observable<User[]> {
      return this.http.get<User[]>(this.apiUrl);
    }
  
    // Supprimer un utilisateur par son ID
    deleteUser(userId: number): Observable<any> {
      return this.http.delete(`${this.apiUrl}/${userId}`);
    }

      // Méthode pour récupérer les rôles d'un utilisateur
  getUserRole(userId: number): Observable<Role> {
    return this.http.get<Role>(`${this.apiUrl}/roles/${userId}`);
  }
}
