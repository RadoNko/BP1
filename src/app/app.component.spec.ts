import {async, TestBed} from '@angular/core/testing';
import {AppComponent} from './app.component';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialImportModule} from './material-import/material-import.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormBuilderModule} from './form-builder/form-builder.module';
import {ModelerModule} from './modeler/modeler.module';
import {DashboardModule} from './dashboard-builder/dashboard-builder.module';
import {ProjectBuilderModule} from './project-builder/project-builder.module';
import {HomeModule} from './home/home.module';
import {ProfileModule} from './profile/profile.module';
import {SettingsModule} from './settings/settings.module';
import {MatListModule} from '@angular/material';
import {RouterTestingModule} from '@angular/router/testing';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      imports: [
        BrowserModule,
        BrowserAnimationsModule,
        MaterialImportModule,
        FlexLayoutModule,
        FormBuilderModule,
        ModelerModule,
        DashboardModule,
        ProjectBuilderModule,
        HomeModule,
        ProfileModule,
        SettingsModule,
        MatListModule,
        RouterTestingModule
      ]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'Application Builder'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('Application Builder');
  });
});
