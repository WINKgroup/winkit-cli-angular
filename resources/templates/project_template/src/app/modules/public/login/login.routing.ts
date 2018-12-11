import {ModuleRouting} from '../../../@core/models/ModuleRouting';
import {PublicLayoutComponent} from '../../../@core/layouts/public/public-layout.component';
import {LoginComponent} from './login.component';

export const LOGIN_ROUTING: ModuleRouting = {
  componentRoutes: [
    {
      path: 'login',
      component: PublicLayoutComponent,
      children: [{
        path: '',
        component: LoginComponent
      }]
    }
  ],
};
