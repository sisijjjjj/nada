import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.css']
})
export class PaymentSuccessComponent implements OnInit {
  isLoading: boolean = true; // Initialisé à true par défaut

  constructor() { }

  ngOnInit(): void {
    // Simulation de chargement
    setTimeout(() => {
      this.isLoading = false;
    }, 2000); // Désactive le loading après 2 secondes
  }
}