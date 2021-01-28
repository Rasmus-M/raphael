import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AboutDialogComponent} from './about-dialog.component';
import {MatDialogRef} from '@angular/material/dialog';

describe('AboutDialogComponent', () => {
  let component: AboutDialogComponent;
  let fixture: ComponentFixture<AboutDialogComponent>;

  const mockDialogRef = {
    close: jasmine.createSpy('close')
  };

  beforeEach(async(() => {
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
