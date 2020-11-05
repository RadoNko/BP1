import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeatmapModeComponent } from './heatmap-mode.component';

describe('HeatmapModeComponent', () => {
  let component: HeatmapModeComponent;
  let fixture: ComponentFixture<HeatmapModeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeatmapModeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeatmapModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
