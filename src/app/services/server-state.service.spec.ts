import { TestBed } from '@angular/core/testing';

import { ServerStateService } from './server-state.service';

describe('ServerStateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ServerStateService = TestBed.get(ServerStateService);
    expect(service).toBeTruthy();
  });
});
