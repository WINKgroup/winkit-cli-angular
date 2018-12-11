import {UserRole} from '../services/session.service';

export interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    autorizedUsers: UserRole[];
}
