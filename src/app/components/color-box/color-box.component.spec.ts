import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {ColorBoxComponent} from './color-box.component';
import {Color} from '../../classes/color';

describe('ColorComponent', () => {
  let component: ColorBoxComponent;
  let fixture: ComponentFixture<ColorBoxComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ColorBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorBoxComponent);
    component = fixture.componentInstance;
    component.color = new Color(0, 0, 0);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
