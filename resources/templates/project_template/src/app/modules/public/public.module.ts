import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {CoreModule} from '../../@core/core.module';
import {LoginModule} from './login/login.module';
import {RecoveryPasswordModule} from './recovery-password/recovery-password.module';
import {RegisterModule} from './register/register.module';
import {ResetPasswordModule} from './reset-password/reset-password.module';

/**
 * in this model you can find all base components that group all base methods and attributes.
 */
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CoreModule,
    RouterModule,
    NgbModule.forRoot(),
    LoginModule,
    RecoveryPasswordModule,
    RegisterModule,
    ResetPasswordModule,
  ]
})
export class PublicModule {
}
