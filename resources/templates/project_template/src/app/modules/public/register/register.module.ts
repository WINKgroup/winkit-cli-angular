import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {RegisterComponent} from './register.component';
import {CoreModule} from '../../../@core/core.module';
import {TranslateModule} from '@ngx-translate/core';
import {REGISTER_ROUTING} from './regsiter.routing';

/**
 * in this model you can find all base components that group all base methods and attributes.
 */
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CoreModule,
    RouterModule.forChild(REGISTER_ROUTING.componentRoutes),
    NgbModule.forRoot(),
    TranslateModule.forChild({})
  ],
  declarations: [
    RegisterComponent
  ],
  exports: [
    RegisterComponent
  ]
})
export class RegisterModule {
}
