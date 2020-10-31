import {Component, OnInit} from '@angular/core';
import {I18nModeService} from '../../../i18n-mode/i18n-mode.service';

@Component({
  selector: 'nab-dialog-add-language',
  templateUrl: './dialog-add-language.component.html',
  styleUrls: ['./dialog-add-language.component.scss']
})
export class DialogAddLanguageComponent implements OnInit {

selectedLanguage: any;
  constructor(private i18nModeService: I18nModeService) {
  }

  ngOnInit(): void {
  }

}
