import {I18nTranslation} from './i18n-translation';

export class I18nTranslations {

  constructor(public locale: string, public i18n: Array<I18nTranslation> = []) {
  }

  public clone(): I18nTranslations {
    const c = new I18nTranslations(this.locale, []);
    c.i18n = this.i18n.map(trans => ({id: trans.id, trans: trans.trans}));
    return c;
  }
}
