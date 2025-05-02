import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationRequest } from 'src/_models/auth.model';

import { ApiRoutingUserService } from 'src/app/services/api-routing-user.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  showPassword = false;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private apiRoutingService: ApiRoutingUserService,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/^(?=.*[a-zA-Z])(?=.*[0-9]).{6,}$/)
      ]],
      rememberMe: [false]
    });
  }

  isFieldInvalid(field: string): boolean {
    const control = this.loginForm.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    this.errorMessage = null;

    if (this.loginForm.valid) {
      this.isLoading = true;
      const authRequest: AuthenticationRequest = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      };

      this.apiRoutingService.requestApi('/authenticate', authRequest).subscribe({
        next: (response: any) => {
          console.log('Réponse backend :', response);
          if (response && response.token) {
            localStorage.setItem('token', response.token);
            const decodedToken = this.authService.getDecodedToken();
            const role = decodedToken?.role;
            this.redirectUser(role) // ou appelle redirectUser(role);
          } else {
            this.errorMessage = "Email ou mot de passe incorrect.";
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Erreur authentification:', error);
          this.errorMessage = error.error?.message || "Une erreur est survenue lors de la connexion.";
          this.isLoading = false;
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  private redirectUser(role: string): void {
    switch (role) {
      case 'ADMIN':
      case 'ORGANIZER':
        this.router.navigate(['/admin']);
        break;
      case 'PARTICIPANT':
      default:
        this.router.navigate(['/home']);
        break;
    }
  }

  // private redirectUser(role: string): void {
  //   switch (role) {
  //     case 'ADMIN':
  //     case 'ORGANIZER':
  //       this.router.navigate(['/admin']);
  //       break;
  //     case 'PARTICIPANT':
  //     default:
  //       this.router.navigate(['/home']);
  //       break;
  //   }
  // }
}
