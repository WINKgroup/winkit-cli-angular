import {ModuleRouting} from '../../../@core/models/ModuleRouting';
import {PublicLayoutComponent} from '../../../@core/layouts/public/public-layout.component';
import {RegisterComponent} from './register.component';

export const REGISTER_ROUTING: ModuleRouting = {
  componentRoutes: [
    {
      path: 'register',
      component: PublicLayoutComponent,
      children: [{
        path: '',
        component: RegisterComponent
      }]
    }
  ],
};
