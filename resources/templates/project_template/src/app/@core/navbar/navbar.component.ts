import {Component} from '@angular/core';
import {environment} from '../../../environments/environment';
import {SIDEBAR_ROUTES} from '../sidebar/sidebar-routes.config';
import {SessionService} from '../services/session.service';
import {AuthenticationService} from '../services/authentication.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  environment = environment;

  constructor(private authService: AuthenticationService) {
  }

  isCollapsed = true;
  /**
   * assign as menu items just the routes associated to the loggedInUser role.
   *
   * @type {RouteInfo[]}
   */
  menuItems = SIDEBAR_ROUTES.filter(value => value.autorizedUsers.indexOf(SessionService.getLoggedInUser().userRole) > -1);

  logout() {
    this.authService.logout();
  }

}
