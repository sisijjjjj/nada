import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllTemplateFrontComponent } from './FrontOffice/all-template-front/all-template-front.component';
import { AllTemplateBackComponent } from './BackOffice/all-template-back/all-template-back.component';
import { InscriptionComponent } from './components/inscription/inscription.component';
import { LoginComponent } from './components/login/login.component';
import { SessionListComponent } from './components/session-list/session-list.component';
import { SessionListUserComponent } from './components/session-list-user/session-list-user.component';
import { HomeFrontComponent } from './FrontOffice/home-front/home-front.component';
import { JitsiMeetComponent } from './components/jitsi-meet/jitsi-meet.component';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { AuthGuard } from './auth.guard';
import { SubmissionsComponent } from './components/submissions/submissions.component';
import { ListUtilisateurComponent } from './components/list-utilisateur/list-utilisateur.component';
import { DocumentComponent } from './components/document/document.component';


const routes: Routes = [
  // Redirection par défaut
  { path: '', pathMatch: 'full', component: LoginComponent }, // Ou laisser vide
  { path: 'login', component: LoginComponent },
  { path: 'inscription', component: InscriptionComponent },

  { path: 'home', component: AllTemplateFrontComponent, canActivate: [AuthGuard], data: {roles: ['PARTICIPANT']}},
  { path: 'sessions', component: SessionListComponent, canActivate: [AuthGuard], data: {roles: ['PARTICIPANT']}},
  { path: 'meet', component: JitsiMeetComponent, canActivate: [AuthGuard], data: {roles: ['PARTICIPANT']}},
  { path: 'unauthorized', component: UnauthorizedComponent},
  { path: 'cv', component: DocumentComponent, canActivate: [AuthGuard], data: {roles: ['PARTICIPANT']}},


  { 
    path: 'admin', component: AllTemplateBackComponent, canActivate: [AuthGuard], data: {roles: ['ADMIN', 'ORGANIZER']},
    // path: 'admin', component: AllTemplateBackComponent,
    children: [
      { path: 'sessions', component: SessionListComponent, canActivate: [AuthGuard], data: {roles: ['ORGANIZER', 'ADMIN']} },
      { path: 'list', component: SessionListComponent, canActivate: [AuthGuard], data: {roles: ['ORGANIZER', 'ADMIN']} },
      { path: 'submissions', component: SubmissionsComponent, canActivate: [AuthGuard], data: {roles: ['ORGANIZER', 'ADMIN']}},
      { path: 'listUsers', component: ListUtilisateurComponent, canActivate: [AuthGuard], data: {roles: ['ADMIN']}},
    ]
  },

  // Compatibilité avec anciennes routes
  { path: 'sessionUser', component: SessionListUserComponent, canActivate: [AuthGuard], data: {roles: ['PARTICIPANT']} },
  // { path: 'list', redirectTo: 'admin/sessions' },

  // Fallback
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
