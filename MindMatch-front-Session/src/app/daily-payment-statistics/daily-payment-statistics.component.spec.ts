import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyPaymentStatisticsComponent } from './daily-payment-statistics.component';

describe('DailyPaymentStatisticsComponent', () => {
  let component: DailyPaymentStatisticsComponent;
  let fixture: ComponentFixture<DailyPaymentStatisticsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DailyPaymentStatisticsComponent]
    });
    fixture = TestBed.createComponent(DailyPaymentStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
