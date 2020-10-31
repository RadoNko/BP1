import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAddLanguageComponent } from './dialog-add-language.component';

describe('DialogAddLanguageComponent', () => {
  let component: DialogAddLanguageComponent;
  let fixture: ComponentFixture<DialogAddLanguageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogAddLanguageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogAddLanguageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
