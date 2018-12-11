import {UserRole} from '../../../@core/services/session.service';
import {Mappable} from '../../../@core/models/Mappable';
import {ServerUser} from './ServerUser';

export class User implements Mappable<User> {
  id: string;
  wid: string;
  userRole?: UserRole;
  firstName?: string;
  lastName?: string;
  description?: string;
  email?: string;
  telephone?: string;
  password?: string;
  dateOfBirth?: Date;
  registeredAt?: Date;
  profileImg?: string;
  fullName?: string;
  isMale?: boolean;
  media?: any[];

  constructor()
  constructor(id?: string,
              email?: string,
              password?: string,
              userRole?: UserRole,
              firstName?: string,
              lastName?: string,
              description?: string,
              telephone?: string,
              profileImg?: string,
              dateOfBirth?: Date,
              isMale?: boolean,
              media?: any[],
              registeredAt?: Date) {
    this.id = typeof id !== 'undefined' ? id : null;
    this.wid = typeof id !== 'undefined' ? id : null;
    this.userRole = typeof userRole !== 'undefined' ? userRole : null;
    this.email = typeof email !== 'undefined' ? email : null;
    this.firstName = typeof firstName !== 'undefined' ? firstName : null;
    this.lastName = typeof lastName !== 'undefined' ? lastName : null;
    this.description = typeof description !== 'undefined' ? description : null;
    this.telephone = typeof telephone !== 'undefined' ? telephone : null;
    this.password = typeof password !== 'undefined' ? password : null;
    this.dateOfBirth = typeof dateOfBirth !== 'undefined' ? dateOfBirth : null;
    this.registeredAt = typeof registeredAt !== 'undefined' ? registeredAt : null;
    this.profileImg = typeof profileImg !== 'undefined' ? profileImg : null;
    this.isMale = typeof isMale !== 'undefined' ? isMale : null;
    this.media = typeof media !== 'undefined' ? media : null;
    this.fullName = (lastName || '') + (lastName && firstName ? ' ' : '') + (firstName || '');
  }

  /**
   * call this method to map the ServerUser to User
   *
   * @param {ServerUser} serverObject
   * @returns {User}
   */
  map(serverObject: ServerUser): User {
    const u = ServerUser.mapReverse(serverObject);
    Object.keys(this).forEach(k => {
      this[k] = u[k];
    });
    return this;
  }

  /**
   * call this method to map the User to ServerUser
   *
   * @returns {ServerUser}
   */
  mapReverse(): ServerUser {
    return ServerUser.map(this);
  }

}
