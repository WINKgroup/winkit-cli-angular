import {UserRole} from '../../@core/services/session.service';
import {ModuleRouting} from '../../@core/models/ModuleRouting';
import {AuthGuard} from '../../@core/guards/AuthGuard';
import {PlatformLayoutComponent} from '../../@core/layouts/platform/platform-layout.component';
import {AdminGuard} from '../../@core/guards/AdminGuard';
import {UserDetailComponent} from './user-detail/user-detail.component';
import {UserListComponent} from './user-list/user-list.component';

export const USER_ROUTING: ModuleRouting = {
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
          canActivate: [AdminGuard],
          path: 'user/:id',
          component: UserDetailComponent
        },
        {
          path: 'profile',
          component: UserDetailComponent
        },
        {
          canActivate: [AdminGuard],
          path: 'user-list',
          component: UserListComponent
        },
      ]
    }
  ],
  routeInfo: {
    path: '/user-list',
    title: 'User list',
    icon: 'people',
    autorizedUsers: [UserRole.ADMIN]},
};
