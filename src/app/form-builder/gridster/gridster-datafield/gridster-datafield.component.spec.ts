import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridsterDatafieldComponent } from './gridster-datafield.component';

describe('GridsterDatafieldComponent', () => {
  let component: GridsterDatafieldComponent;
  let fixture: ComponentFixture<GridsterDatafieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridsterDatafieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridsterDatafieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
