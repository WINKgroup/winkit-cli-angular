import {User} from '../../modules/user/models/User';
import {Md5} from 'md5-typescript';
import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';

@Injectable()
export class SessionService {

  public static TOKEN_KEY = `com.${encodeURIComponent(environment.APP_NAME)}-backoffice.access_token`;
  public static USER_KEY = `com.${encodeURIComponent(environment.APP_NAME)}-backoffice.logged_in_user`;
  public static USER_KEY_MD5 = `com.${encodeURIComponent(environment.APP_NAME)}-backoffice.logged_in_user_md5`;

  /**
   * save the logged user in Local Storage
   * @param {User} user
   * @param {string} token
   */
  static saveLoggedInUser(user: User, token?: string) {
    localStorage.setItem(SessionService.USER_KEY, JSON.stringify(user));
    localStorage.setItem(SessionService.USER_KEY_MD5, Md5.init('#$/N0nPu01Fr3g4r3W1nk/*@' + Md5.init(JSON.stringify(user))));
    localStorage.setItem(SessionService.TOKEN_KEY, 'Bearer ' + token);
  }

  static getAccessToken(): string {
    return localStorage.getItem(SessionService.TOKEN_KEY);
  }

  static isLoggedIn(): boolean {
    return localStorage.getItem(SessionService.USER_KEY) != null && localStorage.getItem(SessionService.USER_KEY_MD5) != null;
  }

  static clearSession() {
    localStorage.clear();
  }

  static getLoggedInUser(): User {
    const sU = localStorage.getItem(SessionService.USER_KEY);
    const sMd5 = localStorage.getItem(SessionService.USER_KEY_MD5);
    if (sMd5 && sMd5 !== Md5.init('#$/N0nPu01Fr3g4r3W1nk/*@' + Md5.init(sU))) {
      this.clearSession();
    }
    const user = JSON.parse(localStorage.getItem(SessionService.USER_KEY));
    return user as User;
  }

}

/**
 * here you can edit the user roles in the platform
 */
export enum UserRole {
  ADMIN = 'ADMIN' as any,
  EDITOR = 'EDITOR' as any,
  CUSTOMER = 'CUSTOMER' as any,
}
