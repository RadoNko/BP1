import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { I18nModeComponent } from './i18n-mode.component';

describe('I18nModeComponent', () => {
  let component: I18nModeComponent;
  let fixture: ComponentFixture<I18nModeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ I18nModeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(I18nModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
