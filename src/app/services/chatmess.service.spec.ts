import { TestBed } from '@angular/core/testing';

import { ChatmessService } from './chatmess.service';

describe('ChatmessService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ChatmessService = TestBed.get(ChatmessService);
    expect(service).toBeTruthy();
  });
});
