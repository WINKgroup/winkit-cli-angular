import {Component, Injector, OnInit, ViewChild} from '@angular/core';
import {environment} from '../environments/environment';
import {NavigationEnd, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {CookieService} from 'ngx-cookie-service';

declare const ga: Function;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public static LANGUAGE_KEY = `com.${encodeURIComponent(environment.APP_NAME)}-backoffice.language`;

  router: Router;
  translate: TranslateService;
  cookieService: CookieService;
  currentLanguage: string = environment.DEFAULT_LANGUAGE;
  languages = ['en', 'it'];

  @ViewChild('cookieLaw')
  private cookieLawEl: any;
  private cookieLawSeen: boolean;

  constructor(private injector: Injector) {
    this.router = injector.get(Router);
    this.translate = injector.get(TranslateService);
    this.cookieService = injector.get(CookieService);

    /**
     * Get user language from cookies or set the default one.
     *
     * @type {string}
     */
    this.currentLanguage = this.cookieService.get(AppComponent.LANGUAGE_KEY) || environment.DEFAULT_LANGUAGE;
    this.translate.setDefaultLang(this.currentLanguage);

    /**
     * Put in the environment your ANALYTICS_UA_ID from Google to start analyzing the platform usage, every time that the page change data will be sent
     *
     */
    if (environment.ANALYTICS_UA_ID.length > 0) {
      this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          ga('set', 'page', event.urlAfterRedirects);
          ga('send', 'pageview');
        }
      });
    }
  }

  ngOnInit() {
    /**
     * Put in the environment your ANALYTICS_UA_ID and create a Google Analytics instance
     *
     */
    if (environment.ANALYTICS_UA_ID.length > 0) {
      this.startGoogleAnalytics(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');
      ga('create', environment.ANALYTICS_UA_ID, 'auto');
    }
    this.cookieLawSeen = this.cookieLawEl.cookieLawSeen;
  }

  /**
   * change the language and save preference as cookie
   *
   * @param {string} language
   */
  useLanguage(language: string) {
    this.currentLanguage = language;
    this.translate.use(this.currentLanguage);
    this.cookieService.set(AppComponent.LANGUAGE_KEY, this.currentLanguage);
  }

  /**
   * start Google Analytics
   *
   * @param i
   * @param s
   * @param o
   * @param g
   * @param r
   * @param a
   * @param m
   */
  private startGoogleAnalytics(i, s, o, g, r, a?, m?) {
    console.log('entered');
    i['GoogleAnalyticsObject'] = r;
    i[r] = i[r] || function () {
      (i[r].q = i[r].q || []).push(arguments);
    };
    i[r].l = new Date();
    a = s.createElement(o);
    m = s.getElementsByTagName(o)[0];
    a.async = 1;
    a.src = g;
    m.parentNode.insertBefore(a, m);
  }
}
