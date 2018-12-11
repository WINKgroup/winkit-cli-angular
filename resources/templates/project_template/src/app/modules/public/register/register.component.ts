import {Component, Injector, OnInit} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {BaseComponent} from '../../../@core/base-component/base.component';
import {User} from '../../user/models/User';
import {CustomNotification, CustomNotificationDuration, CustomNotificationType} from '../../../@core/models/CustomNotification';
import {UserRole} from '../../../@core/services/session.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent extends BaseComponent implements OnInit {
  environment = environment;
  user: User = new User();
  confirmPassword: string = '';

  constructor(protected injector: Injector) {
    super(injector);
    this.setTitle(this.translateService.instant('Register'));
  }

  ngOnInit() {
  }

  submit(model: User, isValid: boolean) {
    console.log(model, isValid);
    if (isValid && this.confirmPassword.length > 0 && this.confirmPassword === this.user.password) {
      this.createUser();
    }
  }

  createUser() {
    this.isLoading = true;
    this.user.userRole = UserRole.CUSTOMER;
    this.authService.signup(this.user.email, this.user.password).then(() => {
      CustomNotification.showNotification(this.toastr, this.translateService.instant('Operation completed successfully!'), '', CustomNotificationType.SUCCESS, CustomNotificationDuration.SLOW);
      this.isLoading = false;
      this.router.navigateByUrl('/login');
    }).catch((error) => {
      console.log(error);
      this.isLoading = false;
      this.handleAPIError(error);
    });
  }

}
