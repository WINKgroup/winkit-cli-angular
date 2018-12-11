import {Routes} from '@angular/router';
import {PublicLayoutComponent} from './@core/layouts/public/public-layout.component';
import {PolicyComponent} from './shared/components/policy/policy.component';

export const AppRoutes: Routes = [
  /**
   * put here all public routes.
   */
  {
    path: 'privacy-and-cookies-policy',
    component: PublicLayoutComponent,
    children: [{
      path: '',
      component: PolicyComponent
    }]
  }, {
    /**
     * redirect all incorrect routes to dashboard.
     */
    path: '**',
    redirectTo: 'dashboard'
  }];
