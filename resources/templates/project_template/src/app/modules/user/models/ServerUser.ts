import {User} from './User';
import {UserRole} from '../../../@core/services/session.service';
import config from '../user.conf.json';

export class ServerUser {
    _id?: string;
    wid?: string;
    userRole?: string;
    firstName?: string;
    lastName?: string;
    description?: string;
    email?: string;
    telephone?: string;
    password?: string;
    dateOfBirth?: number;
    registeredAt?: number;
    profileImg?: string;
    isMale?: boolean;
    media = [];

    /**
     * call this method to map the User to ServerUser
     *
     * @param {} obj
     * @returns {ServerUser}
     */
    static map(obj: User): ServerUser {
        const u = {} as ServerUser;
        u._id = typeof obj.id !== 'undefined' ? obj.id : null;
        u.wid = typeof obj.id !== 'undefined' ? obj.id : null;
        for (let k in config.properties) {
            const prop = config.properties[k];
            u[prop.name] = this.getMappedAttribute(obj, prop.name, prop.hasOwnProperty('value') ? prop.value : null)
        }
        return u;
    }

    /**
     * call this method to map the ServerUser to User
     *
     * @param {ServerUser} obj
     * @returns {}
     */
    static mapReverse(obj: ServerUser): User {
        const u = {} as User;
        u.id = typeof obj._id !== 'undefined' ? obj._id : null;
        u.wid = typeof obj._id !== 'undefined' ? obj._id : null;
        for (let k in config.properties) {
            const prop = config.properties[k];
            u[prop.name] = this.getReverseMappedAttribute(obj, prop.name, prop.hasOwnProperty('value') ? prop.value : null)
        }
        return u;
    }

    private static getMappedAttribute(model: User, attributeName: string, defaultValue: any = null) {
        switch (attributeName) {
            case 'dateOfBirth':
            case 'registeredAt':
                return model[attributeName] ? model[attributeName].getTime() : defaultValue;
            case 'userRole':
                return typeof model[attributeName] !== 'undefined' ? model[attributeName].toString() : defaultValue;
            default:
                return typeof model[attributeName] !== 'undefined' ? model[attributeName] : defaultValue;
        }
    }

    private static getReverseMappedAttribute(serverObject: ServerUser, attributeName: string, defaultValue: any = null) {
        switch (attributeName) {
            case 'dateOfBirth':
            case 'registeredAt':
                return serverObject[attributeName] ? new Date(serverObject[attributeName]) : defaultValue;
            case 'userRole':
                return typeof serverObject.userRole !== 'undefined' ? UserRole[serverObject.userRole.toUpperCase()] : defaultValue;
            case 'fullName':
                return (serverObject.lastName || '') + (serverObject.lastName && serverObject.firstName ? ' ' : '') + (serverObject.firstName || '');
            default:
                return typeof serverObject[attributeName] !== 'undefined' ? serverObject[attributeName] : defaultValue;
        }
    }
}
