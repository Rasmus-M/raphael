import { TestBed, waitForAsync } from '@angular/core/testing';
import {AppComponent} from './app.component';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {Overlay} from '@angular/cdk/overlay';

describe('AppComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      providers: [
        MatDialog,
        Overlay
      ],
      imports: [ MatDialogModule ]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
