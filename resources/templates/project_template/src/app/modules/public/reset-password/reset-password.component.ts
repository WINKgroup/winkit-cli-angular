import {BaseComponent} from '../../../@core/base-component/base.component';
import {environment} from '../../../../environments/environment';
import {Component, OnInit, Injector} from '@angular/core';
import {CustomNotification, CustomNotificationDuration, CustomNotificationType} from '../../../@core/models/CustomNotification';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent extends BaseComponent implements OnInit {
  environment = environment;
  code: string;
  newPassword;
  passwordConfirmation;

  constructor(protected injector: Injector) {
    super(injector);
    this.setTitle(this.translateService.instant('Reset password'));
  }

  ngOnInit() {
    this.code = this.activatedRoute.snapshot.queryParamMap.get('code');
    if (!this.code) {
      this.router.navigate(['/recovery-password']);
    }
  }

  submit(form, valid) {
    if (valid && form.value.newPassword === form.value.passwordConfirmation) {
      this.isLoading = true;
      this.authService.resetPassword(form.value.newPassword, form.value.passwordConfirmation, this.code)
        .then(res => {
          CustomNotification.showNotification(this.toastr, this.translateService.instant('Password resetted!'), '', CustomNotificationType.SUCCESS, CustomNotificationDuration.SLOW);
          this.isLoading = false;
          this.router.navigate(['/login']);
        })
        .catch(error => {
          console.log(error);
          this.isLoading = false;
          this.handleAPIError(error);
        });
    }
  }
}
