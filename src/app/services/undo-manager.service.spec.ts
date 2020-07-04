import { TestBed } from '@angular/core/testing';

import { UndoManagerService } from './undo-manager.service';

describe('UndoManagerService', () => {
  let service: UndoManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UndoManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
