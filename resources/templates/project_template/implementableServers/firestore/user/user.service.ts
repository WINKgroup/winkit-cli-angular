import {Injectable, Injector} from '@angular/core';
import {User} from '../models/User';
import * as firebase from 'firebase';
import {UserServiceModel} from '../../../@core/models/UserServiceModel';
import {BaseService} from '../../../@core/services/base.service';
import config from '../../../../../winkit.conf.json';

const pk = config['primaryKey'];

@Injectable()

export class UserService extends BaseService<User> implements UserServiceModel<User> {

  constructor(protected injector: Injector) {
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

  createUser(user: User): Promise<boolean> {
    const password = user.password;
    return firebase.auth().createUserWithEmailAndPassword(user.email, password).then(cUser => {
      console.log('cUser', cUser);
      user[pk] = cUser.user.uid;
      user.registeredAt = new Date();
      user.password = null;
      this.setPagination();
      return this.postObject(user).then(() => {
        return true;
      }).catch((error) => {
        return cUser.user.delete().then(() => {
          console.log('User removed:', error);
          throw error;
        });
      });
    }).catch((error) => {
      throw this.handleError(error);
    });
  }

  updateUser(user: User): Promise<boolean> {
    return this.patchObject(user);
  }

  // TODO using Cloud Function to delete user from auth
  deleteUser(id: string): Promise<boolean> {
    return this.deleteObject(id);
  }

  /**
   * recovery your password
   *
   * @param email
   * @returns {Promise<boolean>}
   */
  forgotPassword(email): Promise<boolean> {
    return firebase.auth().sendPasswordResetEmail(email)
      .then(() => {
        return true;
      })
      .catch((error) => {
        throw this.handleError(error);
      });
  }

}
