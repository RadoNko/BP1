import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridsterComponent } from './gridster.component';

describe('FieldListComponent', () => {
  let component: GridsterComponent;
  let fixture: ComponentFixture<GridsterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridsterComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridsterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
