import {Mappable} from './Mappable';
import {BaseServiceModel} from './BaseServiceModel';

export interface AuthenticationServiceModel<T extends Mappable<T>> extends BaseServiceModel<T> {

  signup(email: string, password: string): Promise<boolean>;

  standardLogin(email: string, password: string): Promise<T>;

  requestPassword(email: string): Promise<boolean>;

  resetPassword(password, passwordConfirmation, code): Promise<boolean>;

  logout();
}
