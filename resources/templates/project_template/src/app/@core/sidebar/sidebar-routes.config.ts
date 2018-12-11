import {RouteInfo} from './sidebar.metadata';
import {DASHBOARD_ROUTING} from '../../modules/dashboard/dashboard.routing';
import {USER_ROUTING} from '../../modules/user/user.routing';

/**
 * put here every menu voice that you want to show in your sidebar and navbar (for mobile).
 *
 * path {string} the final path
 * title {string} title to show
 * icon {string} associated material icon name (https://material.io/tools/icons/)
 * autorizedUsers {UserRole[]} pust here all type of user that can see the voice
 *
 * @type {[RouteInfo]}
 */
export const SIDEBAR_ROUTES: RouteInfo[] = [
  DASHBOARD_ROUTING.routeInfo,
  USER_ROUTING.routeInfo,
];
