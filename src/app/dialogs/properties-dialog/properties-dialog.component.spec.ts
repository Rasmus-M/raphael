import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {PropertiesDialogComponent} from './properties-dialog.component';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

describe('PropertiesDialogComponent', () => {
  let component: PropertiesDialogComponent;
  let fixture: ComponentFixture<PropertiesDialogComponent>;

  const mockDialogRef = {
    close: jasmine.createSpy('close')
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertiesDialogComponent ],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertiesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
