import { TestBed } from '@angular/core/testing';

import { NgxIntlService } from './ngx-intl.service';

describe('NgxIntlService', () => {
  let service: NgxIntlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxIntlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
