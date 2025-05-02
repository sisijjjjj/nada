import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// Components
import { AppComponent } from './app.component';
import { AllTemplateBackComponent } from './BackOffice/all-template-back/all-template-back.component';
import { NavebarBackComponent } from './BackOffice/navebar-back/navebar-back.component';
import { SidebarBackComponent } from './BackOffice/sidebar-back/sidebar-back.component';
import { AllTemplateFrontComponent } from './FrontOffice/all-template-front/all-template-front.component';
import { FooterFrontComponent } from './FrontOffice/footer-front/footer-front.component';
import { HomeFrontComponent } from './FrontOffice/home-front/home-front.component';
import { HeaderFrontComponent } from './FrontOffice/header-front/header-front.component';
import { InscriptionComponent } from './components/inscription/inscription.component';
import { LoginComponent } from './components/login/login.component';
import { SessionListUserComponent } from './components/session-list-user/session-list-user.component';
import { SessionListComponent } from './components/session-list/session-list.component';
import { JitsiMeetComponent } from './components/jitsi-meet/jitsi-meet.component';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { SubmissionsComponent } from './components/submissions/submissions.component';
import { ListUtilisateurComponent } from './components/list-utilisateur/list-utilisateur.component';
import { DocumentComponent } from './components/document/document.component';
import { PaymentComponent } from './payment/payment.component';
import { PaymentCancelComponent } from './payment-cancel/payment-cancel.component';
import { PaymentSuccessComponent } from './payment-success/payment-success.component';

// Modules
import { AppRoutingModule } from './app-routing.module';
import { NgChartsModule } from 'ng2-charts';
import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';
import { JwtHelperService } from '@auth0/angular-jwt';

// Remove DailyPaymentStatisticsComponent if not used or implement it properly
// import { DailyPaymentStatisticsComponent } from './daily-payment-statistics/daily-payment-statistics.component';

export function jwtOptionsFactory() {
  return {
    tokenGetter: () => {
      return localStorage.getItem('token');
    },
    allowedDomains: ['localhost:8088'],
    disallowedRoutes: [
      'http://localhost:8088/api/v1/users/authenticate',
      'http://localhost:8088/api/v1/users/register'
    ]
  };
}

@NgModule({
  declarations: [
    AppComponent,
    AllTemplateBackComponent,
    NavebarBackComponent,
    SidebarBackComponent,
    AllTemplateFrontComponent,
    FooterFrontComponent,
    HomeFrontComponent,
    HeaderFrontComponent,
    InscriptionComponent,
    LoginComponent,
    SessionListUserComponent,
    SessionListComponent,
    JitsiMeetComponent,
    UnauthorizedComponent,
    SubmissionsComponent,
    ListUtilisateurComponent,
    DocumentComponent,
    // DailyPaymentStatisticsComponent, // Commented out until properly implemented
    PaymentComponent,
    PaymentCancelComponent,
    PaymentSuccessComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    CommonModule,
    BrowserAnimationsModule,
    NgChartsModule,
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory
      }
    })
  ],
  providers: [
    JwtHelperService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }