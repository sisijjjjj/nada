import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionListUserComponent } from './session-list-user.component';

describe('SessionListUserComponent', () => {
  let component: SessionListUserComponent;
  let fixture: ComponentFixture<SessionListUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SessionListUserComponent]
    });
    fixture = TestBed.createComponent(SessionListUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
