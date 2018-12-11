import {ModuleRouting} from '../../../@core/models/ModuleRouting';
import {PublicLayoutComponent} from '../../../@core/layouts/public/public-layout.component';
import {RecoveryPasswordComponent} from './recovery-password.component';

export const RECOVERY_PASSWORD_ROUTING: ModuleRouting = {
  componentRoutes: [
    {
      path: 'recovery-password',
      component: PublicLayoutComponent,
      children: [{
        path: '',
        component: RecoveryPasswordComponent
      }]
    }
  ],
};
