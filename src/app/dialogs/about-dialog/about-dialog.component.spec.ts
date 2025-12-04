import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {AboutDialogComponent} from './about-dialog.component';
import {MatLegacyDialogRef as MatDialogRef} from '@angular/material/legacy-dialog';

describe('AboutDialogComponent', () => {
  let component: AboutDialogComponent;
  let fixture: ComponentFixture<AboutDialogComponent>;

  const mockDialogRef = {
    close: jasmine.createSpy('close')
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AboutDialogComponent ],
      providers: [ { provide: MatDialogRef, useValue: mockDialogRef } ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
