const moduleTemplate = `import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../../shared/shared.module';
import {ComponentsModule} from '../../shared/components/components.module';
import {TranslateModule} from '@ngx-translate/core';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {**ThisName.toUpperCase()**_ROUTING} from './**ThisName.toLowerCase()**.routing';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ComponentsModule,
    TranslateModule,
    FormsModule,
    RouterModule.forChild(**ThisName.toUpperCase()**_ROUTING.componentRoutes),
  ],
  declarations: [
  ],
  exports: [
  ],
  providers: [
  ]
})
export class **ThisName**Module { }
`;

const configTemplate = `{
  "properties": [
  ]
}
`;

const moduleRoutingTemplate = `import {UserRole} from '../../@core/services/session.service';
import {ModuleRouting} from '../../@core/models/ModuleRouting';
import {AuthGuard} from '../../@core/guards/AuthGuard';
import {AdminGuard} from '../../@core/guards/AdminGuard';
import {PlatformLayoutComponent} from '../../@core/layouts/platform/platform-layout.component';

export const **ThisName.toUpperCase()**_ROUTING: ModuleRouting = {
  componentRoutes: [
    {
      path: '',
      redirectTo: 'dashboard',
      pathMatch: 'full'
    },
    {
      path: '',
      canActivate: [AuthGuard],
      component: PlatformLayoutComponent,
      children: [
      ]
    }
  ],
};
`;

module.exports = {
    moduleTemplate, configTemplate, moduleRoutingTemplate
};