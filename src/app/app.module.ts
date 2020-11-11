import {BrowserModule, DomSanitizer} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MaterialImportModule} from './material-import/material-import.module';
import {FormBuilderModule} from './form-builder/form-builder.module';
import {RouterModule, Routes} from '@angular/router';
import {FormBuilderComponent} from './form-builder/form-builder.component';
import {ModelerComponent} from './modeler/modeler.component';
import {ModelerModule} from './modeler/modeler.module';
import {EditModeComponent} from './modeler/edit-mode/edit-mode.component';
import {SimulationModeComponent} from './modeler/simulation-mode/simulation-mode.component';
import {DataModeComponent} from './modeler/data-mode/data-mode.component';
import {RoleModeComponent} from './modeler/role-mode/role-mode.component';
import {ActionsModeComponent} from './modeler/actions-mode/actions-mode.component';
import {I18nModeComponent} from './modeler/i18n-mode/i18n-mode.component';
import {MatIconRegistry} from '@angular/material/icon';
import {HeatmapModeComponent} from "./modeler/heatmap-mode/heatmap-mode.component";

const appRoutes: Routes = [
  {
    path: 'modeler', component: ModelerComponent, children: [
      {path: '', component: EditModeComponent},
      {path: 'simulation', component: SimulationModeComponent},
      {path: 'data', component: DataModeComponent},
      {path: 'roles', component: RoleModeComponent},
      {path: 'actions', component: ActionsModeComponent},
      {path: 'i18n', component: I18nModeComponent},
      {path: 'heatmap', component: HeatmapModeComponent},
    ]
  },
  {path: 'form', component: FormBuilderComponent},
  {path: '**', redirectTo: 'modeler'}
];

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialImportModule,
    FlexLayoutModule,
    FormBuilderModule,
    ModelerModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {

  constructor(matIconRegistry: MatIconRegistry, domSanitizer: DomSanitizer) {
    matIconRegistry.addSvgIconSet(domSanitizer.bypassSecurityTrustResourceUrl('./assets/mdi.svg'));
    localStorage.removeItem('TransitionId');
  }
}
