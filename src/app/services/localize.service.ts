import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalizeService {

  language: string = "fr"; // default
  languageSubject = new Subject<string>();

  constructor() { }

  emitLanguageSubject() {
    this.languageSubject.next(this.language);
  }

  changeLanguage(lang: string) {
    this.language = lang;
    this.emitLanguageSubject();
  }
}
