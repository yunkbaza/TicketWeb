import {
  Injectable,
  computed,
  signal
} from '@angular/core';

export type AppLanguage =
  | 'pt'
  | 'en';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private readonly _language =
    signal<AppLanguage>('pt');

  readonly currentLanguage =
    this._language.asReadonly();

  readonly isPortuguese =
    computed(
      () => this._language() === 'pt'
    );

  readonly isEnglish =
    computed(
      () => this._language() === 'en'
    );

  toggleLanguage() {
    this._language.update(language =>
      language === 'pt'
        ? 'en'
        : 'pt'
    );
  }

  setLanguage(language: AppLanguage) {
    this._language.set(language);
  }

  translate(
    portuguese: string,
    english: string
  ) {
    return this.isPortuguese()
      ? portuguese
      : english;
  }
}