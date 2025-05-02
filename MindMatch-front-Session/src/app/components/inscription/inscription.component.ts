import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ERole } from 'src/_models/Role.model copy';

import { ApiRoutingUserService } from 'src/app/services/api-routing-user.service';

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.css']
})
export class InscriptionComponent implements OnInit {
  registerFormTunisie: FormGroup;
  showPassword = false;
  showConfirmPassword = false;
  hintField: string | null = null;
  num = '+216';
  passwordStrength = 0;
  roles = Object.values(ERole);
  roleLabels = {
    [ERole.ADMIN]: 'Administrateur',
    [ERole.PARTICIPANT]: 'Participant',
    [ERole.ORGANIZER]: 'Organisateur'
  };
  popupMessage: string | null = null;
  popupType: 'success' | 'error' = 'success';  // 'success' or 'error'

  constructor(private fb: FormBuilder, private router: Router, private apiRoutingServiceUser: ApiRoutingUserService) {
    this.registerFormTunisie = this.fb.group({
      dateOfBirth: [''],
      address: ['', [Validators.required]],
      sexe: ['', [Validators.required]],
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      country: ['Tunisie'],
      phone: ['', [
        Validators.required,
        Validators.pattern('^[0-9]{8}$')
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/^(?=.*[a-zA-Z])(?=.*[0-9]).{6,}$/)
      ]],
      confirmPassword: ['', Validators.required],
      role: ['', Validators.required]
    }, { validators: this.matchPasswordValidator });

    this.registerFormTunisie.get('password')?.valueChanges.subscribe(val => {
      this.calculatePasswordStrength(val);
    });
  }

  ngOnInit(): void {
    if (this.router.url.includes('register-tunisie')) {
      this.registerFormTunisie.patchValue({ country: 'Tunisie' });
    }
  }

  calculatePasswordStrength(password: string): void {
    let strength = 0;
    if (password.length > 5) strength += 1;
    if (password.length > 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    this.passwordStrength = Math.min(strength, 5);
  }

  isFieldInvalid(field: string): boolean {
    const control = this.registerFormTunisie.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  private matchPasswordValidator(group: FormGroup): { [key: string]: boolean } | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  limitInputLength(event: KeyboardEvent): void {
    const inputElement = event.target as HTMLInputElement;
    if (!/^[0-9]$/.test(event.key) && event.key !== 'Backspace') {
      event.preventDefault();
    }
    if (inputElement.value.length >= 8 && event.key !== 'Backspace') {
      event.preventDefault();
    }
  }

  onphoneInput(): void {
    const phoneControl = this.registerFormTunisie.get('phone');
    if (phoneControl) {
      phoneControl.updateValueAndValidity();
    }
  }

  showHint(field: string): void {
    this.hintField = field;
  }

  hideHint(): void {
    this.hintField = null;
  }

  onSubmit(): void {
    if (this.registerFormTunisie.valid) {
      const formData = this.registerFormTunisie.value;

      this.apiRoutingServiceUser.requestApi('/register', formData)
        .subscribe({
          next: (response) => {
            console.log(response)
            console.log('sucess')
            this.showPopup('Inscription réussie!', 'success');
            setTimeout(() => this.router.navigate(['/login']), 2000); // Redirect after 2 seconds
          },
          error: (error) => {
            console.log('echec')
            this.showPopup(`Inscription échouée: ${error.error}`, 'error');
          }
        });
    } else {
      this.showPopup('Veuillez remplir tous les champs correctement', 'error');
    }
  }

  showPopup(message: string, type: 'success' | 'error'): void {
    this.popupMessage = message;
    this.popupType = type;
    setTimeout(() => {
      this.popupMessage = null;
    }, 3000); // Hide popup after 3 seconds
  }
}
