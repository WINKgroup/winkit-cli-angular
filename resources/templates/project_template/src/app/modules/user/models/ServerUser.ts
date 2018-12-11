import {User} from './User';
import {UserRole} from '../../../@core/services/session.service';

export class ServerUser {
  _id?: string;
  wid?: string;
  userRole?: string;
  firstName?: string;
  lastName?: string;
  description?: string;
  email?: string;
  telephone?: string;
  profileImg?: string;
  dateOfBirth?: number;
  registeredAt?: number;
  isMale?: boolean;
  password?: string;
  username?: string;
  media?: any[];

  /**
   * call this method to map the User to ServerUser
   *
   * @param {} user
   * @returns {ServerUser}
   */
  static map(user: User): ServerUser {
    const u = {} as ServerUser;
    u._id = typeof user.id !== 'undefined' ? user.id : null;
    u.wid = typeof user.id !== 'undefined' ? user.id : null;
    u.userRole = typeof user.userRole !== 'undefined' ? user.userRole.toString() : null;
    u.firstName = typeof user.firstName !== 'undefined' ? user.firstName : null;
    u.lastName = typeof user.lastName !== 'undefined' ? user.lastName : null;
    u.email = typeof user.email !== 'undefined' ? user.email : null;
    u.description = typeof user.description !== 'undefined' ? user.description : null;
    u.telephone = typeof user.telephone !== 'undefined' ? user.telephone : null;
    u.profileImg = typeof user.profileImg !== 'undefined' ? user.profileImg : null;
    u.isMale = typeof user.isMale !== 'undefined' ? user.isMale : null;
    u.media = typeof user.media !== 'undefined' ? user.media : [];
    u.dateOfBirth = user.dateOfBirth ? user.dateOfBirth.getTime() : null;
    u.registeredAt = user.registeredAt ? user.registeredAt.getTime() : null;
    return u;
  }

  /**
   * call this method to map the ServerUser to User
   *
   * @param {ServerUser} serverObject
   * @returns {}
   */
  static mapReverse(serverObject: ServerUser): User {
    const u = {} as User;
    u.id = typeof serverObject._id !== 'undefined' ? serverObject._id : null;
    u.wid = typeof serverObject._id !== 'undefined' ? serverObject._id : null;
    u.userRole = typeof serverObject.userRole !== 'undefined' ? UserRole[serverObject.userRole.toUpperCase()] : null;
    u.email = typeof serverObject.email !== 'undefined' ? serverObject.email : null;
    u.firstName = typeof serverObject.firstName !== 'undefined' ? serverObject.firstName : null;
    u.lastName = typeof serverObject.lastName !== 'undefined' ? serverObject.lastName : null;
    u.description = typeof serverObject.description !== 'undefined' ? serverObject.description : null;
    u.telephone = typeof serverObject.telephone !== 'undefined' ? serverObject.telephone : null;
    u.profileImg = typeof serverObject.profileImg !== 'undefined' ? serverObject.profileImg : null;
    u.profileImg = typeof serverObject.profileImg !== 'undefined' ? serverObject.profileImg : null;
    u.dateOfBirth = typeof serverObject.dateOfBirth !== 'undefined' ? new Date(serverObject.dateOfBirth) : null;
    u.registeredAt = typeof serverObject.registeredAt !== 'undefined' ? new Date(serverObject.registeredAt) : null;
    u.isMale = typeof serverObject.isMale !== 'undefined' ? serverObject.isMale : null;
    u.media = typeof serverObject.media !== 'undefined' ? serverObject.media : [];
    u.fullName = (serverObject.lastName || '') + (serverObject.lastName && serverObject.firstName ? ' ' : '') + (serverObject.firstName || '');
    return u;
  }
}
