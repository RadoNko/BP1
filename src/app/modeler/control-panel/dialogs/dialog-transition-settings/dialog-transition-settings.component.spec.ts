import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogTransitionSettingsComponent } from './dialog-transition-settings.component';

describe('DialogTransitionSettingsComponent', () => {
  let component: DialogTransitionSettingsComponent;
  let fixture: ComponentFixture<DialogTransitionSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogTransitionSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogTransitionSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
