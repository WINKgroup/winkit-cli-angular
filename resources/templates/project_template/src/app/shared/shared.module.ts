import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {PipeModule} from './pipes/pipe.module';
import {ComponentsModule} from './components/components.module';

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
    PipeModule,
  ]
})
export class SharedModule {
}
