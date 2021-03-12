import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestElasticConnectionComponent } from './test-elastic-connection.component';

describe('TestElasticConnectionComponent', () => {
  let component: TestElasticConnectionComponent;
  let fixture: ComponentFixture<TestElasticConnectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestElasticConnectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestElasticConnectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
