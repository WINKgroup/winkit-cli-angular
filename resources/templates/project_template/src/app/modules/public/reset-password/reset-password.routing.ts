import {ModuleRouting} from '../../../@core/models/ModuleRouting';
import {PublicLayoutComponent} from '../../../@core/layouts/public/public-layout.component';
import {ResetPasswordComponent} from './reset-password.component';

export const RESET_PASSWORD_ROUTING: ModuleRouting = {
  componentRoutes: [
    {
      path: 'reset-password',
      component: PublicLayoutComponent,
      children: [{
        path: '',
        component: ResetPasswordComponent
      }]
    }
  ],
};
