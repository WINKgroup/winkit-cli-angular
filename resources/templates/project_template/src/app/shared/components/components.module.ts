import {NgModule} from '@angular/core';
import {FiltersComponent} from './filters/filters.component';
import {TableComponent} from './table/table.component';
import {ToolbarComponent} from './toolbar/toolbar.component';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {NgbModalModule, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {PipeModule} from '../pipes/pipe.module';
import {MatIconModule} from '@angular/material';
import {FormsModule} from '@angular/forms';
import {MediaInputComponent} from './media-manager/media-input/media-input.component';
import {MediaModalComponent} from './media-manager/media-modal/media-modal.component';
import {TranslateModule} from '@ngx-translate/core';
import {PolicyComponent} from './policy/policy.component';
import {CookieLawModule} from 'angular2-cookie-law';
import {StorageService} from './media-manager/storage.service';
import {FormElementComponent} from './form-element/form-element.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NgbModule.forRoot(),
    PipeModule.forRoot(),
    TranslateModule.forChild({}),
    MatIconModule,
    FormsModule,
    NgbModalModule,
    CookieLawModule,
  ],
  declarations: [
    FiltersComponent,
    TableComponent,
    ToolbarComponent,
    MediaInputComponent,
    MediaModalComponent,
    PolicyComponent,
    FormElementComponent,
  ],
  exports: [
    FiltersComponent,
    TableComponent,
    ToolbarComponent,
    MediaInputComponent,
    MediaModalComponent,
    PolicyComponent,
    FormElementComponent,
  ],
  providers: [
    StorageService,
  ],
  entryComponents: [MediaModalComponent]
})
export class ComponentsModule {
}
