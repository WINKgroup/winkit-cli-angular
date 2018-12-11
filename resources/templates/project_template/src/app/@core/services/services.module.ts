import {NgModule} from '@angular/core';
import {GoogleAnalyticsEventsService} from './google-analytics-events.service';
import {MessageService} from './message.service';
import {SessionService} from './session.service';
import {LocalStoreService} from './local-store.service';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ToastrModule} from 'ngx-toastr';
import {HttpClientModule} from '@angular/common/http';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {AuthenticationService} from './authentication.service';
import {UserService} from '../../modules/user/service/user.service';

@NgModule({
  imports: [
    NgbModule.forRoot(),
    ToastrModule.forRoot(),
    HttpClientModule,
    NoopAnimationsModule,
  ],
  declarations: [],
  exports: [],
  providers: [
    AuthenticationService,
    GoogleAnalyticsEventsService,
    MessageService,
    SessionService,
    LocalStoreService,
    UserService,
  ],
})
export class ServicesModule {
}
