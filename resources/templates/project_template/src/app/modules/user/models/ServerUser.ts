import {User} from './User';
import {UserRole} from '../../../@core/services/session.service';
import {ModelProperty} from '../../../@core/models/ModelConfig';
import config from '../user.conf.json';

export class ServerUser {
    _id: string;
    wid: string;
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
            const prop: ModelProperty = config.properties[k];
            if (!prop.skipUpdate) {
                const serverName = prop.serverName || prop.name;
                u[serverName] = this.getMappedAttribute(obj, prop);
            }
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
            const prop: ModelProperty = config.properties[k];
            if (!prop.skipUpdate) {
                const localName = prop.mapReverseName || prop.name;
                u[localName] = this.getReverseMappedAttribute(obj, prop);
            }
        }
        return u;
    }

    private static getMappedAttribute(model: User, prop: ModelProperty) {
        const localName = prop.relationship || prop.name;
        const defaultValue = prop.hasOwnProperty('value') ? prop.value : null;
        switch (prop.name) {
            case 'dateOfBirth':
                return model.dateOfBirth ? model.dateOfBirth.getTime() : defaultValue;
            case 'registeredAt':
                return model.registeredAt ? model.registeredAt.getTime() : defaultValue;
            case 'userRole':
                return typeof model.userRole !== 'undefined' ? model.userRole.toString() : defaultValue;
            default:
                return typeof model[localName] !== 'undefined' ? model[localName] : defaultValue;
        }
    }

    private static getReverseMappedAttribute(serverObject: ServerUser, prop: ModelProperty) {
        const serverName = prop.mapReverseRelationship || prop.serverName || prop.name;
        const defaultValue = prop.hasOwnProperty('value') ? prop.value : null;
        switch (prop.name) {
            case 'dateOfBirth':
                return serverObject.dateOfBirth ? new Date(serverObject.dateOfBirth) : defaultValue;
            case 'registeredAt':
                return serverObject.registeredAt ? new Date(serverObject.registeredAt) : defaultValue;
            case 'userRole':
                return typeof serverObject.userRole !== 'undefined' ? UserRole[serverObject.userRole.toUpperCase()] : defaultValue;
            case 'fullName':
                return (serverObject.lastName || '') + (serverObject.lastName && serverObject.firstName ? ' ' : '') + (serverObject.firstName || '');
            default:
                return typeof serverObject[serverName] !== 'undefined' ? serverObject[serverName] : defaultValue;
        }
    }
}