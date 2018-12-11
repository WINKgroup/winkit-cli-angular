import {Injectable, Injector} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';
import * as firebase from 'firebase';
import {SessionService, UserRole} from './session.service';
import {User} from '../../modules/user/models/User';
import {Observable} from 'rxjs/index';
import {Router} from '@angular/router';
import {AuthenticationServiceModel} from '../models/AuthenticationServiceModel';
import {UserService} from '../../modules/user/service/user.service';
import {BaseService} from './base.service';

@Injectable()
export class AuthenticationService extends BaseService<User> implements AuthenticationServiceModel<User> {

  user: Observable<firebase.User>;

  constructor(private firebaseAuth: AngularFireAuth,
              private router: Router,
              protected injector: Injector,
              protected userService: UserService) {
    super(injector);
    this.user = firebaseAuth.authState;
  }

  protected modelConstructor(): User {
    return new User();
  }

  signup(email: string, password: string): Promise<boolean> {
    const user = new User();
    user.userRole = UserRole.CUSTOMER;
    user.email = email;
    user.password = password;
    return this.userService.createUser(user);
  }

  standardLogin(email: string, password: string): Promise<User> {
    return this.firebaseAuth
      .auth
      .signInWithEmailAndPassword(email, password)
      .then(value => {
        return this.userService.getUserById(value.user.uid).then(user => {
          console.log('User', user);
          SessionService.saveLoggedInUser(user);
          return user;
        }).catch(error => {
          throw this.handleError(error);
        });
      })
      .catch(error => {
        throw this.handleError(error);
      });
  }

  requestPassword(email: string): Promise<any> {
    return this.firebaseAuth
      .auth
      .sendPasswordResetEmail(email)
      .then(value => {
        console.log(value);
        return value;
      })
      .catch(error => {
        throw this.handleError(error);
      });
  }

  resetPassword(password, passwordConfirmation, code): Promise<boolean> {
    return new Promise(resolve => resolve(false));
  }

  logout() {
    this.firebaseAuth
      .auth
      .signOut();
    SessionService.clearSession();
    this.router.navigateByUrl('/login');
  }

}
