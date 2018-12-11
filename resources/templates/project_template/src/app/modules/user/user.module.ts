import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserService} from './service/user.service';
import {UserDetailComponent} from './user-detail/user-detail.component';
import {UserListComponent} from './user-list/user-list.component';
import {SharedModule} from '../../shared/shared.module';
import {ComponentsModule} from '../../shared/components/components.module';
import {TranslateModule} from '@ngx-translate/core';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {USER_ROUTING} from './user.routing';
import {MatIconModule} from '@angular/material';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ComponentsModule,
    TranslateModule,
    FormsModule,
    RouterModule.forChild(USER_ROUTING.componentRoutes),
    NgbModule.forRoot(),
    MatIconModule
  ],
  declarations: [
    UserDetailComponent,
    UserListComponent
  ],
  exports: [
    UserDetailComponent,
    UserListComponent
  ],
  providers: [
    UserService
  ]
})
export class UserModule { }
