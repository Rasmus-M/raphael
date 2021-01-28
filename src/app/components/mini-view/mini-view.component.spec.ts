import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MiniViewComponent} from './mini-view.component';
import {Grid} from '../../classes/grid';

describe('MiniViewComponent', () => {
  let component: MiniViewComponent;
  let fixture: ComponentFixture<MiniViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MiniViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MiniViewComponent);
    component = fixture.componentInstance;
    component.grid = new Grid();
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
