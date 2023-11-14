import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService, TranslationChangeEvent } from '@ngx-translate/core';
import { DValidateRules } from 'ng-devui';
import { FormLayout } from 'ng-devui';
import { I18nService } from 'ng-devui/i18n';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/@core/services/auth.service';
import { PersonalizeService } from 'src/app/@core/services/personalize.service';
import { LANGUAGES } from 'src/config/language-config';
import { ThemeType } from '../../models/theme';

@Component({
  selector: 'da-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  private destroy$ = new Subject<void>();

  horizontalLayout: FormLayout = FormLayout.Horizontal;

  showPassword = false;

  language: string;
  i18nValues: any;
  toastMessage: any;
  languages = LANGUAGES;

  formData = {
    username: 'Admin',
    password: 'DevUI.admin',
  };

  formRules: { [key: string]: DValidateRules } = {
    usernameRules: {
      validators: [
        { required: true },
        { minlength: 3 },
        { maxlength: 20 },
        {
          pattern: /^[a-zA-Z\d]+(\s+[a-zA-Z\d]+)*$/,
          message: 'The user name cannot contain characters except uppercase and lowercase letters.',
        },
      ],
    },
    passwordRules: {
      validators: [{ required: true }, { minlength: 6 }, { maxlength: 15 }, { pattern: /^[a-zA-Z\d@$!%*?&.]+(\s+[a-zA-Z\d]+)*$/ }],
      message: 'Enter a password that contains 6 to 15 digits and letters.',
    },
  };

  constructor(
    private router: Router,
    private authService: AuthService,
    private translate: TranslateService,
    private i18n: I18nService,
    private personalizeService: PersonalizeService,
  ) {
    this.language = this.translate.currentLang;
  }

  ngOnInit(): void {
    this.translate
      .get('loginPage')
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.i18nValues = this.translate.instant('loginPage');
      });

    this.translate
      .onLangChange
      .pipe(takeUntil(this.destroy$))
      .subscribe((_e: TranslationChangeEvent) => {
        this.i18nValues = this.translate.instant('loginPage');
      });
    this.personalizeService.setRefTheme(ThemeType.Default);
  }

  doLogin() {
    this.authService
      .login(this.formData.username, this.formData.password)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
          this.authService.setSession(res);
          this.router.navigate(['/'])
            .then(() => {
            })
            .catch((reason) => {
              console.warn('navigate[\'/\'] failed', reason);
            });
        },
        (_e) => {
          this.toastMessage = [
            {
              severity: 'error',
              summary: this.i18nValues['noticeMessage']['summary'],
              content: this.i18nValues['noticeMessage']['accountContent'],
            },
          ];
        },
      );
  }

  onLanguageClick(language: string) {
    this.language = language;
    localStorage.setItem('lang', this.language);
    this.i18n.toggleLang(this.language);
    this.translate.use(this.language);
  }
}
