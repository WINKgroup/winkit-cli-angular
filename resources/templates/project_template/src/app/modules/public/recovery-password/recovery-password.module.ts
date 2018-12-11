import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {CoreModule} from '../../../@core/core.module';
import {RecoveryPasswordComponent} from './recovery-password.component';
import {TranslateModule} from '@ngx-translate/core';
import {RECOVERY_PASSWORD_ROUTING} from './recovery-password.routing';

/**
 * in this model you can find all base components that group all base methods and attributes.
 */
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CoreModule,
    RouterModule.forChild(RECOVERY_PASSWORD_ROUTING.componentRoutes),
    NgbModule.forRoot(),
    TranslateModule.forChild({})
  ],
  declarations: [
    RecoveryPasswordComponent
  ],
  exports: [
    RecoveryPasswordComponent
  ]
})
export class RecoveryPasswordModule {
}
