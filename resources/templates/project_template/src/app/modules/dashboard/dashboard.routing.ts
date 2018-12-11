import {ModuleRouting} from '../../@core/models/ModuleRouting';
import {AuthGuard} from '../../@core/guards/AuthGuard';
import {PlatformLayoutComponent} from '../../@core/layouts/platform/platform-layout.component';
import {DashboardComponent} from './dashboard.component';
import {UserRole} from '../../@core/services/session.service';

export const DASHBOARD_ROUTING: ModuleRouting = {
  componentRoutes: [
    {
      path: '',
      redirectTo: 'dashboard',
      pathMatch: 'full'
    },
    {
      path: '',
      canActivate: [AuthGuard],
      component: PlatformLayoutComponent,
      /**
       * put as children all the routes that need an authenticated user.
       */
      children: [
        {
          path: 'dashboard',
          component: DashboardComponent
        },
      ]
    }
  ],
  routeInfo: {
    path: '/dashboard',
    title: 'Dashboard',
    icon: 'home',
    autorizedUsers: [UserRole.ADMIN, UserRole.EDITOR, UserRole.CUSTOMER]},
};
