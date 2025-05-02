import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navebar-back',
  templateUrl: './navebar-back.component.html',
  styleUrls: ['./navebar-back.component.css']
})
export class NavebarBackComponent {
  constructor(public authService: AuthService,     public router: Router  ) {}

  logout(): void {
    if (confirm('Voulez-vous vraiment vous déconnecter ?')) {
      this.authService.logout();
      this.router.navigate(['/login']);
    }
  }
}
