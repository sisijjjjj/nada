import { Component, AfterViewInit, OnDestroy, Input } from '@angular/core';

declare var JitsiMeetExternalAPI: any;

@Component({
  selector: 'app-jitsi-meet',
  templateUrl: './jitsi-meet.component.html',
  styleUrls: ['./jitsi-meet.component.css']
})
export class JitsiMeetComponent implements AfterViewInit, OnDestroy {
  @Input() roomName: string = `AngularMeet-${Math.random().toString(36).substring(2, 7)}`;
  @Input() userName: string = 'Utilisateur';
  @Input() password: string = '';
  
  private api: any;
  private scriptLoaded = false;

  ngAfterViewInit(): void {
    if (this.scriptLoaded) {
      this.initializeJitsi();
    } else {
      this.loadJitsiScript();
    }
  }

  private loadJitsiScript(): void {
    const existingScript = document.getElementById('jitsi-script');
    
    if (existingScript) {
      this.scriptLoaded = true;
      this.initializeJitsi();
      return;
    }

    const script = document.createElement('script');
    script.id = 'jitsi-script';
    script.src = 'https://meet.jit.si/external_api.js';
    script.onload = () => {
      this.scriptLoaded = true;
      this.initializeJitsi();
    };
    script.onerror = () => console.error('Erreur de chargement du script Jitsi');
    document.body.appendChild(script);
  }

  private initializeJitsi(): void {
    try {
      this.api = new JitsiMeetExternalAPI('meet.jit.si', {
        roomName: this.roomName,
        parentNode: document.getElementById('jitsi-container'),
        configOverwrite: {
          prejoinPageEnabled: false,
          disableDeepLinking: true,
          disableInviteFunctions: true,
          startWithAudioMuted: true,
          startWithVideoMuted: false,
          enableWelcomePage: false,
          disableRemoteMute: true
        },
        interfaceConfigOverwrite: {
          DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          MOBILE_APP_PROMO: false,
          HIDE_INVITE_MORE_HEADER: true,
          TOOLBAR_BUTTONS: [
            'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
            'hangup', 'profile', 'chat', 'recording', 'settings', 'raisehand'
          ]
        },
        userInfo: {
          displayName: this.userName,
        }
      });

      this.api.addListener('readyToClose', () => this.cleanup());
      this.api.addListener('participantJoined', (data: any) => console.log('Rejoint:', data));
      this.api.addListener('participantLeft', (data: any) => console.log('Quitté:', data));

    } catch (error) {
      console.error('Erreur Jitsi:', error);
      alert('Impossible de démarrer la conférence');
    }
  }

  // Mettez cleanup en public pour qu'il soit accessible dans le template
  public cleanup(): void {
    if (this.api) {
      this.api.dispose();
    }
    const container = document.getElementById('jitsi-container');
    if (container) container.innerHTML = '';
  }

  ngOnDestroy(): void {
    this.cleanup();
    const script = document.getElementById('jitsi-script');
    if (script) script.remove();
  }
}
