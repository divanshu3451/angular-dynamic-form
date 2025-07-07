import { TestBed } from '@angular/core/testing';

import { DynamicFormValidatorService } from './dynamic-form-validator.service';

describe('DynamicFormValidatorService', () => {
  let service: DynamicFormValidatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DynamicFormValidatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
