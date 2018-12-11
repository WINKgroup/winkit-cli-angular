import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {CoreModule} from '../../../@core/core.module';
import {LoginComponent} from './login.component';
import {TranslateModule} from '@ngx-translate/core';
import {LOGIN_ROUTING} from './login.routing';

/**
 * in this model you can find all base components that group all base methods and attributes.
 */
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CoreModule,
    RouterModule.forChild(LOGIN_ROUTING.componentRoutes),
    NgbModule.forRoot(),
    TranslateModule.forChild({})
  ],
  declarations: [
    LoginComponent
  ],
  exports: [
    LoginComponent
  ]
})
export class LoginModule {
}
