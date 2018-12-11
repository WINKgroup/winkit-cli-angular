import {Routes} from '@angular/router';
import {RouteInfo} from '../sidebar/sidebar.metadata';

export interface ModuleRouting {
  componentRoutes?: Routes;
  routeInfo?: RouteInfo;
}
