import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/@core/services/auth.service';
import { LANGUAGES } from 'src/config/language-config';
import { User } from '../../../models/user';
import { I18nService } from 'ng-devui/i18n';

@Component({
  selector: 'da-header-operation',
  templateUrl: './header-operation.component.html',
  styleUrls: ['./header-operation.component.scss'],
})
export class HeaderOperationComponent implements OnInit {
  languages = LANGUAGES;
  language: string = '';
  loggedIn = false;
  noticeCount: number = 0;

  constructor(private route: Router, private authService: AuthService, private translate: TranslateService, private i18n: I18nService) {
  }

  get user(): User {
    return JSON.parse(localStorage.getItem('userinfo')!) as User;
  }

  ngOnInit(): void {
    this.language = this.translate.currentLang;
  }

  onSearch(event: any) {
    console.log(event);
  }

  onLanguageClick(language: string) {
    this.language = language;
    localStorage.setItem('lang', this.language);
    this.i18n.toggleLang(this.language);
    this.translate.use(this.language);
  }

  handleUserOps(operation: string) {
    switch (operation) {
      case 'logout': {
        this.loggedIn = false;
        this.authService.logout();
        this.route.navigate(['/', 'login']).then(r => {
          location.reload();
        });
        break;
      }
      default:
        break;
    }
  }

  handleNoticeCount(event: number) {
    this.noticeCount = event;
  }
}
