import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const token = this.authService.getToken();

    // 1. Vérifier si l'utilisateur est connecté
    if (!token || !this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return false;
    }

    // 2. Vérifier les rôles si précisés dans la route
    const expectedRoles = route.data['roles'] as string[];
    const userRole = this.authService.getRole();

    if (expectedRoles && !expectedRoles.includes(userRole || '')) {
      this.router.navigate(['/unauthorized']);
      return false;
    }

    // 3. Sinon, accès autorisé
    return true;
  }
}
