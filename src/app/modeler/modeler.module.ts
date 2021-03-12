import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ModelerComponent} from './modeler.component';
import {MaterialImportModule} from '../material-import/material-import.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {ControlPanelComponent} from './control-panel/control-panel.component';
import {DomSanitizer} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {EditPanelModelerComponent} from './edit-panel/edit-panel-modeler.component';
import {TriggerTreeComponent} from './control-panel/trees/trigger-tree/trigger-tree.component';
import {DialogManageRolesComponent} from './control-panel/dialogs/dialog.manage-roles/dialog.manage-roles.component';
import {ValidationTreeComponent} from './control-panel/trees/validation-tree/validation-tree.component';
import {ActionEditorComponent} from './action-editor/action-editor/action-editor.component';
import {ActionEditorListComponent} from './action-editor/action-editor-list/action-editor-list.component';
import {MonacoEditorModule} from 'ngx-monaco-editor';
import {HotkeyModule} from 'angular2-hotkeys';
import {SimulationModeComponent} from './simulation-mode/simulation-mode.component';
import {EditModeComponent} from './edit-mode/edit-mode.component';
import {RouterModule} from '@angular/router';
import {DataModeComponent} from './data-mode/data-mode.component';
import {RoleModeComponent} from './role-mode/role-mode.component';
import {ActionsModeComponent} from './actions-mode/actions-mode.component';
import {DialogArcAttachComponent} from './control-panel/dialogs/dialog-arc-attach/dialog-arc-attach.component';
import {environment} from '../../environments/environment';
import {I18nModeComponent} from './i18n-mode/i18n-mode.component';
import {ResizableModule} from 'angular-resizable-element';
import {DialogDeleteComponent} from '../dialog-delete/dialog-delete.component';
import {DialogTransitionSettingsComponent} from './control-panel/dialogs/dialog-transition-settings/dialog-transition-settings.component';
import {I18nEditorComponent} from './i18n-mode/i18n-editor/i18n-editor.component';
import {DialogAddLanguageComponent} from './control-panel/dialogs/dialog-add-language/dialog-add-language.component';
import {MatIconRegistry} from '@angular/material/icon';
import {CdkTreeModule} from '@angular/cdk/tree';
import { HeatmapModeComponent } from './heatmap-mode/heatmap-mode.component';
import { TestElasticConnectionComponent } from './heatmap-mode/elasticsearch/test-elastic-connection/test-elastic-connection.component';

@NgModule({
    declarations: [
        ModelerComponent,
        ControlPanelComponent,
        DialogManageRolesComponent,
        ValidationTreeComponent,
        EditPanelModelerComponent,
        TriggerTreeComponent,
        ActionEditorComponent,
        ActionEditorListComponent,
        SimulationModeComponent,
        EditModeComponent,
        DataModeComponent,
        RoleModeComponent,
        ActionsModeComponent,
        DialogArcAttachComponent,
        I18nModeComponent,
        DialogDeleteComponent,
        DialogTransitionSettingsComponent,
        I18nEditorComponent,
        DialogAddLanguageComponent,
        HeatmapModeComponent,
        TestElasticConnectionComponent,
    ],
    entryComponents: [
        DialogManageRolesComponent,
        DialogArcAttachComponent,
        DialogDeleteComponent,
        DialogTransitionSettingsComponent,
        DialogAddLanguageComponent
    ],
    exports: [
        ActionEditorListComponent
    ],
    imports: [
        CommonModule,
        MaterialImportModule,
        CdkTreeModule,
        FlexLayoutModule,
        FormsModule,
        RouterModule,
        MonacoEditorModule.forRoot(),
        HotkeyModule.forRoot(),
        ResizableModule,
        ReactiveFormsModule,
    ]
})
export class ModelerModule {
    constructor(matIconRegistry: MatIconRegistry, domSanitizer: DomSanitizer) {
        matIconRegistry.addSvgIcon('transition', domSanitizer.bypassSecurityTrustResourceUrl(`../../..${environment.deployUrl}assets/modeler/icons/transition.svg`));
        matIconRegistry.addSvgIcon('place', domSanitizer.bypassSecurityTrustResourceUrl(`../../..${environment.deployUrl}assets/modeler/icons/place.svg`));
        matIconRegistry.addSvgIcon('staticplace', domSanitizer.bypassSecurityTrustResourceUrl(`../../..${environment.deployUrl}assets/modeler/icons/staticplace.svg`));
        matIconRegistry.addSvgIcon('addtokens', domSanitizer.bypassSecurityTrustResourceUrl(`../../..${environment.deployUrl}assets/modeler/icons/addtokens.svg`));
        matIconRegistry.addSvgIcon('removetokens', domSanitizer.bypassSecurityTrustResourceUrl(`../../..${environment.deployUrl}assets/modeler/icons/removetokens.svg`));
        matIconRegistry.addSvgIcon('marking', domSanitizer.bypassSecurityTrustResourceUrl(`../../..${environment.deployUrl}assets/modeler/icons/marking.svg`));
        matIconRegistry.addSvgIcon('label', domSanitizer.bypassSecurityTrustResourceUrl(`../../..${environment.deployUrl}assets/modeler/icons/label.svg`));
        matIconRegistry.addSvgIcon('arc', domSanitizer.bypassSecurityTrustResourceUrl(`../../..${environment.deployUrl}assets/modeler/icons/arc.svg`));
        matIconRegistry.addSvgIcon('arcweight', domSanitizer.bypassSecurityTrustResourceUrl(`../../..${environment.deployUrl}assets/modeler/icons/arcweight.svg`));
        matIconRegistry.addSvgIcon('arcdataref', domSanitizer.bypassSecurityTrustResourceUrl(`../../..${environment.deployUrl}assets/modeler/icons/arcdataref.svg`));
        matIconRegistry.addSvgIcon('arcplaceref', domSanitizer.bypassSecurityTrustResourceUrl(`../../..${environment.deployUrl}assets/modeler/icons/arcplaceref.svg`));
        matIconRegistry.addSvgIcon('resetarc', domSanitizer.bypassSecurityTrustResourceUrl(`../../..${environment.deployUrl}assets/modeler/icons/resetarc.svg`));
        matIconRegistry.addSvgIcon('inhibitor', domSanitizer.bypassSecurityTrustResourceUrl(`../../..${environment.deployUrl}assets/modeler/icons/inhibitor.svg`));
        matIconRegistry.addSvgIcon('read', domSanitizer.bypassSecurityTrustResourceUrl(`../../..${environment.deployUrl}assets/modeler/icons/read.svg`));
        matIconRegistry.addSvgIcon('position', domSanitizer.bypassSecurityTrustResourceUrl(`../../..${environment.deployUrl}assets/modeler/icons/position.svg`));
        matIconRegistry.addSvgIcon('delete', domSanitizer.bypassSecurityTrustResourceUrl(`../../..${environment.deployUrl}assets/modeler/icons/delete.svg`));
        matIconRegistry.addSvgIcon('move', domSanitizer.bypassSecurityTrustResourceUrl(`../../..${environment.deployUrl}assets/modeler/icons/move.svg`));
        matIconRegistry.addSvgIcon('fire', domSanitizer.bypassSecurityTrustResourceUrl(`../../..${environment.deployUrl}assets/modeler/icons/fire.svg`));

        matIconRegistry.addSvgIcon('undo', domSanitizer.bypassSecurityTrustResourceUrl(`../../..${environment.deployUrl}assets/modeler/icons/undo.svg`));
        matIconRegistry.addSvgIcon('open', domSanitizer.bypassSecurityTrustResourceUrl(`../../..${environment.deployUrl}assets/modeler/icons/open.svg`));
        matIconRegistry.addSvgIcon('reload', domSanitizer.bypassSecurityTrustResourceUrl(`../../..${environment.deployUrl}assets/modeler/icons/reload.svg`));
        matIconRegistry.addSvgIcon('save', domSanitizer.bypassSecurityTrustResourceUrl(`../../..${environment.deployUrl}assets/modeler/icons/save.svg`));
        matIconRegistry.addSvgIcon('exportpflow', domSanitizer.bypassSecurityTrustResourceUrl(`../../..${environment.deployUrl}assets/modeler/icons/exportpflow.svg`));
        matIconRegistry.addSvgIcon('savesvg', domSanitizer.bypassSecurityTrustResourceUrl(`../../..${environment.deployUrl}assets/modeler/icons/savesvg.svg`));
        matIconRegistry.addSvgIcon('clear', domSanitizer.bypassSecurityTrustResourceUrl(`../../..${environment.deployUrl}assets/modeler/icons/clear.svg`));
        matIconRegistry.addSvgIcon('dimension', domSanitizer.bypassSecurityTrustResourceUrl(`../../..${environment.deployUrl}assets/modeler/icons/dimension.svg`));
        matIconRegistry.addSvgIcon('align', domSanitizer.bypassSecurityTrustResourceUrl(`../../..${environment.deployUrl}assets/modeler/icons/align.svg`));
        matIconRegistry.addSvgIcon('data', domSanitizer.bypassSecurityTrustResourceUrl(`../../..${environment.deployUrl}assets/modeler/icons/data.svg`));
        matIconRegistry.addSvgIcon('properties', domSanitizer.bypassSecurityTrustResourceUrl(`../../..${environment.deployUrl}assets/modeler/icons/properties.svg`));
        matIconRegistry.addSvgIcon('about', domSanitizer.bypassSecurityTrustResourceUrl(`../../..${environment.deployUrl}assets/modeler/icons/about.svg`));
    }
}
