import {Injectable, Injector} from '@angular/core';
import * as firebase from 'firebase';
import {Observable} from 'rxjs/index';
import {AngularFirestore} from 'angularfire2/firestore';
import {BaseService} from '../../../@core/services/base.service';
import {Media, MediaType} from './Media';
import {UserMedia} from './UserMedia';


@Injectable()
export class StorageService extends BaseService<any> {

  private userMediaCol;
  storageRef = firebase.storage().ref();
  afs: AngularFirestore;

  protected modelConstructor(): any {
    return null;
  }

  constructor(protected injector: Injector) {
    super(injector);
    this.afs = injector.get(AngularFirestore);
    this.userMediaCol = this.afs.collection('user_media');
  }

  /**
   * upload file in the firebase storage
   *
   * @param {string} userId
   * @param {File} file
   * @param {} type
   * @param {(progress: number) => any} onProgressChanged
   * @returns {Promise<>}
   */
  upload(userId: string, file: File, type: MediaType, onProgressChanged?: (progress: number) => any): Promise<Media> {
    console.log(userId, file);
    const origin = this;
    return new Promise((resolve, reject) => {
      const uploadTask = this.storageRef.child(`${userId}/${file.name}`).put(file, {contentType: file.type});
      uploadTask.on('state_changed', (snapshot: firebase.storage.UploadTaskSnapshot) => {
        if (onProgressChanged) {
          onProgressChanged((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        }
        console.log('Upload is ' + (snapshot.bytesTransferred / snapshot.totalBytes) * 100 + '% done');
      }, (error) => {
        reject(error);
      }, () => {
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
          console.log('File available at', downloadURL);
          const media = {url: downloadURL, type: type} as UserMedia;
          origin.updateUserMediaTable(userId, media, (m: UserMedia) => {
            resolve(m);
          });
        });
      });
    });

  }

  /**
   * get media of a specific user
   *
   * @param {string} userId
   * @returns {Promise<Observable<[]>>}
   */
  async getMediaByUserId(userId: string): Promise<Observable<Media[]>> {
    return new Promise<Observable<Media[]>>(async (resolve, reject) => {
      resolve(this.userMediaCol.doc(userId).collection('items').valueChanges() as Observable<UserMedia[]>);
    });
  }

  /**
   * associate the media to the user in the DB
   *
   * @param {string} idUser
   * @param {UserMedia} media
   * @param {(m: ) => void} onSuccess
   */
  private updateUserMediaTable(idUser: string, media: UserMedia, onSuccess: (m: Media) => void) {
    const d = this.userMediaCol.ref.doc(idUser).collection('items').doc();
    media.id = d.id;
    media.userId = idUser;
    d.set(media).then(() => {
      onSuccess(media);
    }).catch((error) => {
      console.log('Error adding userMedia:', error);
      onSuccess(media);
    });
  }

}
