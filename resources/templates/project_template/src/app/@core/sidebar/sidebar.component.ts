import {Component} from '@angular/core';
import {SIDEBAR_ROUTES} from './sidebar-routes.config';
import {SessionService} from '../services/session.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  /**
   * assign as menu items just the routes associated to the loggedInUser role.
   *
   * @type {RouteInfo[]}
   */
  menuItems = SIDEBAR_ROUTES.filter(value => value.autorizedUsers.indexOf(SessionService.getLoggedInUser().userRole) > -1);

  constructor() {
  }

}
