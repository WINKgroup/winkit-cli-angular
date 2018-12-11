import {Component, Injector, OnInit} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {BaseComponent} from '../../../@core/base-component/base.component';
import {User} from '../../user/models/User';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends BaseComponent implements OnInit {
  environment = environment;
  user: User;

  constructor(protected injector: Injector) {
    super(injector);
    this.setTitle('Login');
  }

  ngOnInit() {
    this.authService.logout();
    this.user = new User();
  }

  submit(model: User, isValid: boolean) {
    console.log(model, isValid);
    if (isValid) {
      this.performLogin(model);
    }
  }

  performLogin(model: User) {
    this.isLoading = true;
    this.authService.standardLogin(model.email, model.password)
      .then(u => {
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      })
      .catch(reason => {
        this.isLoading = false;
        this.handleAPIError(reason);
      });
  }

}
