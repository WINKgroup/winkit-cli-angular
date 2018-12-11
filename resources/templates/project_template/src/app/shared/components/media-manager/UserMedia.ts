import {Media} from './Media';

export interface UserMedia extends Media {
  id: string;
  userId: string;
}
