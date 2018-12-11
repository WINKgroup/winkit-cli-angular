import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {BaseComponent} from './base-component/base.component';
import {BasePageComponent} from './base-page/base-page.component';
import {PlatformLayoutComponent} from './layouts/platform/platform-layout.component';
import {PublicLayoutComponent} from './layouts/public/public-layout.component';
import {FormsModule} from '@angular/forms';
import {ComponentsModule} from '../shared/components/components.module';
import {AuthGuard} from './guards/AuthGuard';
import {AdminGuard} from './guards/AdminGuard';
import {NavbarComponent} from './navbar/navbar.component';
import {SidebarComponent} from './sidebar/sidebar.component';
import {ServicesModule} from './services/services.module';
import {TranslateModule} from '@ngx-translate/core';

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
    ServicesModule,
    TranslateModule.forChild({}),
  ],
  declarations: [
    BaseComponent,
    BasePageComponent,
    PlatformLayoutComponent,
    PublicLayoutComponent,
    NavbarComponent,
    SidebarComponent,
  ],
  exports: [
    BaseComponent,
    BasePageComponent,
    PlatformLayoutComponent,
    PublicLayoutComponent,
    NavbarComponent,
    SidebarComponent,
  ],
  providers: [
    AuthGuard,
    AdminGuard
  ],
})
export class CoreModule {
}
