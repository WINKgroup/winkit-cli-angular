import {Mappable} from './Mappable';
import {BaseServiceModel} from './BaseServiceModel';

export interface UserServiceModel<T extends Mappable<T>> extends BaseServiceModel<T> {

  getUserById(id: string): Promise<T>;

  createUser(user: T): Promise<boolean>;

  updateUser(user: T): Promise<boolean>;

  deleteUser(id: string): Promise<boolean>;

  /**
   * recovery your password
   *
   * @param email
   * @returns {Promise<boolean>}
   */
  forgotPassword(email): Promise<boolean>;
}
