import { Component, OnInit, OnDestroy } from '@angular/core';
import { SessionService } from '../../services/session.service';
import { SubmissionService } from '../../services/submission.service';
import { AuthService } from '../../services/auth.service';

import * as L from 'leaflet';
import { Session } from 'src/_models/session.model';

declare var JitsiMeetExternalAPI: any;

@Component({
  selector: 'app-session-list-user',
  templateUrl: './session-list-user.component.html',
  styleUrls: ['./session-list-user.component.css']
})
export class SessionListUserComponent implements OnInit, OnDestroy {
  selectedSession: Session | null = null;
  searchTerm = '';
  showJitsiModal = false;
  currentUserName = 'Utilisateur';
  sessions: Session[] = [];
  filteredSessions: Session[] = [];
  private map: L.Map | null = null;
  private marker: L.Marker | null = null;
  showMapModal = false;
  mapInitialized = false;
  chatbotVisible = false;
  jitsiApi: any;

  constructor(
    private sessionService: SessionService, 
    private submissionService: SubmissionService, 
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadSessions();
    this.initLeaflet();
  }

  ngOnDestroy(): void {
    this.destroyMap();
    this.destroyJitsi();
  }

  private initLeaflet(): void {
    const iconRetinaUrl = 'assets/marker-icon-2x.png';
    const iconUrl = 'assets/marker-icon.png';
    const shadowUrl = 'assets/marker-shadow.png';

    L.Marker.prototype.options.icon = L.icon({
      iconRetinaUrl,
      iconUrl,
      shadowUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
    this.mapInitialized = true;
  }

  loadSessions(): void {
    this.sessionService.getAllSessions().subscribe(
      (data: Session[]) => {
        this.sessions = data;
        this.filteredSessions = [...this.sessions];
      },
      (err) => {
        console.error('Erreur lors du chargement des sessions', err);
      }
    );
  }

  getImageUrl(session: Session): string {
    return session.imageUrl || 'assets/images/default-session.jpg';
  }

  getFormattedDate(dateString: string | Date): string {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }

  getFormattedTime(dateString: string | Date): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  }

  showLocationOnMap(location: string | undefined): void {
    if (!location || !this.mapInitialized) return;
    
    const [lat, lng] = location.split(',').map(Number);
    this.showMapModal = true;

    setTimeout(() => {
      this.destroyMap();
      
      this.map = L.map('location-map-modal').setView([lat, lng], 15);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(this.map);

      this.marker = L.marker([lat, lng]).addTo(this.map)
        .bindPopup('Lieu de la session')
        .openPopup();
    }, 0);
  }

  private destroyMap(): void {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
    this.marker = null;
  }

  closeMapModal(): void {
    this.showMapModal = false;
    this.destroyMap();
  }

  selectSession(session: Session): void {
    this.selectedSession = this.selectedSession?.id === session.id ? null : session;
  }

  startVideoConference(session: Session, event: Event): void {
    event.stopPropagation();
    this.selectedSession = session;
    this.showJitsiModal = true;

    setTimeout(() => {
      this.initJitsiMeet(session);
    }, 0);
  }

  initJitsiMeet(session: Session): void {
    const domain = 'meet.jit.si';
    const options = {
      roomName: `MatchMind-Session-${session.id}`,
      width: '100%',
      height: 600,
      parentNode: document.getElementById('jitsi-container'),
      userInfo: {
        displayName: this.currentUserName
      },
      configOverwrite: {
        startWithAudioMuted: true,
        startWithVideoMuted: true,
        disableInviteFunctions: true,
        requireDisplayName: true,
        enableLobby: true,
      },
      interfaceConfigOverwrite: {
        SHOW_JITSI_WATERMARK: false,
        SHOW_WATERMARK_FOR_GUESTS: false,
        filmStripOnly: false,
        APP_NAME: 'MatchMind',
      }
    };
    
    this.jitsiApi = new JitsiMeetExternalAPI(domain, options);
  }

  destroyJitsi(): void {
    if (this.jitsiApi) {
      this.jitsiApi.dispose();
      this.jitsiApi = null;
    }
  }

  closeJitsiModal(): void {
    this.showJitsiModal = false;
    this.destroyJitsi();
  }

  searchSessions(): void {
    if (!this.searchTerm) {
      this.filteredSessions = [...this.sessions];
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredSessions = this.sessions.filter(session => {
      return (
        (session.title && session.title.toLowerCase().includes(term)) ||
        (session.description && session.description.toLowerCase().includes(term)) ||
        (session.fullDescription && session.fullDescription.toLowerCase().includes(term))
      );
    });
  }

  toggleChatbot(): void {
    this.chatbotVisible = !this.chatbotVisible;
  }
}