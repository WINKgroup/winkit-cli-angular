import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {ComponentsModule} from '../shared/components/components.module';
import {DashboardModule} from './dashboard/dashboard.module';
import {PublicModule} from './public/public.module';
import {UserModule} from './user/user.module';

/**
 * in this model you can find all base components that group all base methods and attributes.
 */
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ComponentsModule,
    RouterModule,
    NgbModule.forRoot(),
    DashboardModule,
    PublicModule,
    UserModule,
  ]
})
export class ModulesModule {
}
