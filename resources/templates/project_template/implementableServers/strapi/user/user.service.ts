import {environment} from '../../../../environments/environment';
import {Injectable, Injector} from '@angular/core';
import {User} from '../models/User';
import {UserServiceModel} from '../../../@core/models/UserServiceModel';
import {BaseService} from '../../../@core/services/base.service';

@Injectable()

export class UserService extends BaseService<User> implements UserServiceModel<User> {

  constructor(injector: Injector) {
    super(injector);
  }

  protected modelConstructor(): User {
    return new User();
  }

  setPagination(pageSize?: number, filters?: { [key: string]: string }, orderByFieldName?: string) {
    this.reset();
    this.init('users', pageSize, filters, orderByFieldName);
  }

  getUserById(id: string): Promise<User> {
    this.setPagination();
    return this.getObject(id);
  }

  updateUser(user: User): Promise<boolean> {
    return this.patchObject(user);
  }

  deleteUser(id: string): Promise<boolean> {
    return this.deleteObject(id);
  }

  createUser(user: User): Promise<boolean> {
    const url = `${environment.BASE_SERVER_URL}auth/local/register`;
    const data = user.mapReverse() as any;
    data.email = user.email;
    data.username = user.email;
    data.password = user.password;
    return this.postData(url, data);
  }

  /**
   * recovery your password
   *
   * @param email
   * @returns {Promise<boolean>}
   */
  forgotPassword(email): Promise<boolean> {
    const url = `${environment.BASE_SERVER_URL}auth/forgot-password`;
    const data = {
      email,
      url: `${environment.BASE_URL}reset-password`
    };
    return this.postData(url, data).then(() => {
      return true;
    }).catch(error => {
      throw this.handleError(error);
    });
  }
}
