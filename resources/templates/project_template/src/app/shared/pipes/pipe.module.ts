import {NgModule} from '@angular/core';
import {OrderByPipe} from './orderby.pipe';
import {WherePipe} from './where.pipe';
import {KeysPipe} from './keys.pipe';
import {SafePipe} from './safe.pipe';
import {ReversePipe} from './reverse.pipe';

@NgModule({
  imports: [],
  declarations: [
    OrderByPipe,
    WherePipe,
    KeysPipe,
    SafePipe,
    ReversePipe
  ],
  exports: [
    OrderByPipe,
    WherePipe,
    KeysPipe,
    SafePipe,
    ReversePipe
  ],
})

export class PipeModule {

  static forRoot() {
    return {
      ngModule: PipeModule,
      providers: [],
    };
  }
}
