import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {PixelGridComponent} from './pixel-grid.component';
import {Grid} from '../../classes/grid';

describe('PixelGridComponent', () => {
  let component: PixelGridComponent;
  let fixture: ComponentFixture<PixelGridComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PixelGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PixelGridComponent);
    component = fixture.componentInstance;
    component.grid = new Grid();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
