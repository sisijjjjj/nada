import { TestBed } from '@angular/core/testing';

import { DailyPaymentStatisticsService } from './daily-payment-statistics.service';

describe('DailyPaymentStatisticsService', () => {
  let service: DailyPaymentStatisticsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DailyPaymentStatisticsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
