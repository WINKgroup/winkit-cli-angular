import {Component, Injector} from '@angular/core';
import {environment} from '../../../environments/environment';
import {Globals} from '../static/Globals';
import {Utils} from '../static/Utils';
import {Title} from '@angular/platform-browser';
import {CustomNotification, CustomNotificationDuration, CustomNotificationType} from '../models/CustomNotification';
import {ToastrService} from 'ngx-toastr';
import {UserRole} from '../services/session.service';
import {ActivatedRoute, Router} from '@angular/router';
import {GoogleAnalyticsEventsService} from '../services/google-analytics-events.service';
import {TranslateService} from '@ngx-translate/core';
import {AuthenticationService} from '../services/authentication.service';


@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss']
})
export class BaseComponent {
  title: string;
  environment = environment;
  isLoading = false;
  globals = Globals;
  userRole = UserRole;
  router: Router;
  utils = Utils;
  toastr: ToastrService;
  authService: AuthenticationService;
  activatedRoute: ActivatedRoute;
  titleService: Title;
  googleAnalyticsEventsService: GoogleAnalyticsEventsService;
  translateService: TranslateService;

  constructor(protected injector: Injector) {
    this.toastr = injector.get(ToastrService);
    this.router = injector.get(Router);
    this.authService = injector.get(AuthenticationService);
    this.titleService = injector.get(Title);
    this.activatedRoute = injector.get(ActivatedRoute);
    this.googleAnalyticsEventsService = injector.get(GoogleAnalyticsEventsService);
    this.translateService = injector.get(TranslateService);
    this.title = '';
    this.setTitle(this.title);
  }

  /**
   * handle API error for you! Implement it in the catch.
   *
   * @param error
   */
  protected handleAPIError(error: any) {
    if (!error) {
      return;
    }
    console.log(error);
    this.showErrorNotification(error.code, error);
  }

  /**
   * call it On Init of every page component, it will set the default title of your page
   * so you can pass it to the ToolbarComponent and can see the title on the browser card.
   *
   * @param {string} title
   */
  protected setTitle(title: string) {
    this.title = title;
    this.titleService.setTitle(`${title ? this.translateService.instant(title) : ''} | ${environment.APP_NAME}`);
  }

  /**
   * show the default error notification.
   *
   * @param {string} title
   * @param error
   */
  protected showErrorNotification(title: string, error: any) {
    CustomNotification.showNotification(this.toastr, title, error.message ? error.message : 'Unknown error', CustomNotificationType.DANGER, CustomNotificationDuration.MEDIUM);
  }

  /**
   * event fired from .html element (button, link, ... ).
   * */
  protected submitEventToAnalytics(category, action, label, value) {
    this.googleAnalyticsEventsService.emitEvent(category, action, label, value);
  }

}
