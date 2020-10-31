import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { I18nEditorComponent } from './i18n-editor.component';

describe('I18nEditorComponent', () => {
  let component: I18nEditorComponent;
  let fixture: ComponentFixture<I18nEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ I18nEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(I18nEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
