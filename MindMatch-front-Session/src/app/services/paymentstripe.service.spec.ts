import { TestBed } from '@angular/core/testing';

import { PaymentstripeService } from './paymentstripe.service';

describe('PaymentstripeService', () => {
  let service: PaymentstripeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaymentstripeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
