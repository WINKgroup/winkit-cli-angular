import {Injectable, Injector} from '@angular/core';
import {User} from '../../modules/user/models/User';
import {AuthenticationServiceModel} from '../models/AuthenticationServiceModel';
import {environment} from '../../../environments/environment';
import {SessionService, UserRole} from './session.service';
import axios from 'axios';
import {BaseService} from './base.service';
import {ServerUser} from '../../modules/user/models/ServerUser';

@Injectable()
export class AuthenticationService extends BaseService<User> implements AuthenticationServiceModel<User> {
  private authUrl = environment.BASE_SERVER_URL;

  constructor(protected injector: Injector) {
    super(injector);
  }

  protected modelConstructor(): User {
    return new User();
  }

  signup(email: string, password: string) {
    const url = `${environment.BASE_SERVER_URL}auth/local/register`;
    const data = new User().mapReverse() as any;
    data.email = email;
    data.username = email;
    data.password = password;
    data.userRole = UserRole.CUSTOMER;
    return this.postData(url, data);
  }

  standardLogin(email: string, password: string): Promise<User> {
    const url = this.authUrl + 'auth/local';
    const data = {
      identifier: email,
      password: password
    };
    return axios.post(url, data, this.getHeader())
      .then(response => {
        console.log(response);
        const res = response as LoginResponse;
        let u = new User();
        u = u.map(res.data.user);
        SessionService.saveLoggedInUser(u, res.data.jwt);
        return u;
      })
      .catch(error => {
        throw this.handleError(error);
      });
  }

  requestPassword(email: string): Promise<boolean> {
    return undefined;
  }

  logout() {
    SessionService.clearSession();
  }

  resetPassword(password, passwordConfirmation, code): Promise<boolean> {
    const url = `${environment.BASE_SERVER_URL}auth/reset-password`;
    const data = {
      code,
      password,
      passwordConfirmation
    };
    return this.postData(url, data);
  }

}

class LoginResponse {
  data: {
    jwt,
    user: ServerUser
  };
}
