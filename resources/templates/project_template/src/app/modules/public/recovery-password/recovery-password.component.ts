import {Component, Injector, OnInit} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {BaseComponent} from '../../../@core/base-component/base.component';
import {CustomNotification, CustomNotificationDuration, CustomNotificationType} from '../../../@core/models/CustomNotification';
import {UserService} from '../../user/service/user.service';

@Component({
  selector: 'app-recovery-password',
  templateUrl: './recovery-password.component.html',
  styleUrls: ['./recovery-password.component.scss']
})
export class RecoveryPasswordComponent extends BaseComponent implements OnInit {
  environment = environment;

  constructor(protected injector: Injector, public userService: UserService) {
    super(injector);
    this.setTitle(this.translateService.instant('Recovery password'));
  }

  ngOnInit() {
  }

  submit(form, valid) {
    if (valid) {
      this.isLoading = true;
      this.userService.forgotPassword(form.email)
        .then(res => {
          CustomNotification.showNotification(this.toastr, this.translateService.instant('Reset email sent!'), '', CustomNotificationType.SUCCESS, CustomNotificationDuration.VERY_LONG);
          this.isLoading = false;
        })
        .catch(error => {
          this.isLoading = false;
          this.handleAPIError(error);
        });
    }
  }
}
