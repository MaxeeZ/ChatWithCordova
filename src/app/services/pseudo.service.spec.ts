import { TestBed } from '@angular/core/testing';

import { PseudoService } from './pseudo.service';

describe('PseudoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PseudoService = TestBed.get(PseudoService);
    expect(service).toBeTruthy();
  });
});
