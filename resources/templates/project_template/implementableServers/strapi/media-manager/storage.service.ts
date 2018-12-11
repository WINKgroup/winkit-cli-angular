import {Injectable, Injector} from '@angular/core';
import {Observable, Subscriber} from 'rxjs/index';
import {environment} from '../../../../environments/environment';
import axios from 'axios';
import {UserService} from '../../../modules/user/service/user.service';
import {BaseService} from '../../../@core/services/base.service';
import {Media, MediaType} from './Media';


@Injectable()
export class StorageService extends BaseService<any> {

  subscriber: Subscriber<Media[]>;
  mediaList: Media[] = [];
  userService: UserService;

  protected modelConstructor(): any {
    return null;
  }

  constructor(protected injector: Injector) {
    super(injector);
    this.userService = injector.get(UserService);
  }

  /**
   * upload file in the strapi storage
   *
   * @param {string} userId
   * @param {File} file
   * @param {} type
   * @param {(progress: number) => any} onProgressChanged
   * @returns {Promise<>}
   */
  upload(userId: string, file: File, type: MediaType, onProgressChanged?: (progress: number) => any): Promise<Media> {
    console.log(userId, file);
    const url = `${environment.BASE_SERVER_URL}upload`;
    const data = new FormData();
    data.append('files', file);
    data.append('path', 'user/media/');
    data.append('refId', userId);
    data.append('ref', 'user');
    data.append('source', 'user-permissions');
    data.append('field', 'media');
    return axios.post(url, data, this.getHeader()).then((response) => {
      console.log(response, response.data);
      onProgressChanged(100);
      const res = response.data[0];
      const media = {url: res.url, type: type} as Media;
      this.mediaList.push(media);
      this.subscriber.next(this.mediaList);
      this.subscriber.complete();
      return media;
    });
  }

  /**
   * get media of a specific user
   *
   * @param {string} userId
   * @returns {Promise<Observable<[]>>}
   */
  async getMediaByUserId(userId: string): Promise<Observable<Media[]>> {
    const u = await this.userService.getUserById(userId);
    console.log(u);
    this.mediaList = [];
    if (u.media && u.media.length > 0) {
      u.media.forEach(m => {
        const media = {url: environment.BASE_SERVER_URL + m.url.substr(1), type: m.mime.indexOf('pdf') > -1 ? MediaType.PDF : MediaType.IMAGE} as Media;
        this.mediaList.push(media);
      });
    }
    return new Observable(subscriber => {
      this.subscriber = subscriber;
      this.subscriber.next(this.mediaList);
      this.subscriber.complete();
    });
  }

}
