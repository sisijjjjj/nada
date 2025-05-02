import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private router: Router){}

  private jwtHelper = new JwtHelperService();

  getToken(): string | null {
    if (typeof window !== 'undefined') {
     return localStorage.getItem('token');
    }
    return null;
  }

  getRole(): string | null {
    return this.getDecodedToken()?.role || null;
  }

  getEmail(): string | null {
    return this.getDecodedToken()?.email || null;
  }

  getCvId(): number | null {
    return this.getDecodedToken()?.id_cv || null;
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return token ? !this.jwtHelper.isTokenExpired(token) : false;
  }

  logout(): void {
    localStorage.removeItem('token'); // ou adapte getToken() si c'est bien 'auth_token'
    this.router.navigate(['/login']);
  }

  getUserId(): number | null {
    const token = this.getToken();
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      return decodedToken?.userId || null;
    }
    return null;
  }

  getEmailFromToken(): string {
    const token = this.getToken();
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      return decodedToken?.email || '';
    }
    return '';
  }

  getDecodedToken(): any {
    const token = this.getToken();
    if (!token) return null;
    return this.jwtHelper.decodeToken(token);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

}