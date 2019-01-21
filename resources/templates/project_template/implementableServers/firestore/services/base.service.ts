import {Injectable, Injector} from '@angular/core';
import {ResponseError} from '../models/ResponseError';
import {Mappable} from '../models/Mappable';
import {AngularFirestore, AngularFirestoreCollection, CollectionReference, QueryDocumentSnapshot} from 'angularfire2/firestore';
import {BaseServiceModel} from '../models/BaseServiceModel';
import * as firebase from 'firebase';
import {SessionService} from './session.service';
import axios from 'axios';
import config from '../../../../winkit.conf.json';

const pk = config['primaryKey'];

@Injectable()
export abstract class BaseService<T extends Mappable<T>> implements BaseServiceModel<T> {
  afs: AngularFirestore;
  pageSize: number;
  filters: { [key: string]: string };
  last: QueryDocumentSnapshot<any>;
  collection: AngularFirestoreCollection<any>;
  collectionPath: CollectionReference;
  collectionName: string;
  orderByFieldName: string;
  hasNextPage: boolean = true;

  constructor(protected injector: Injector) {
    this.afs = injector.get(AngularFirestore);
  }

  protected abstract modelConstructor(): T;

  protected getHeader(): any {
    return {headers: {'Content-Type': 'application/json', ...SessionService.getAccessToken() ? {'Authorization': SessionService.getAccessToken()} : {}}};
  }

  /**
   * initialize pagination after instantiated the service
   *
   * @param {string} path
   * @param {number} pageSize
   * @param filters
   * @param {string} orderByFieldName
   */
  init(path: string, pageSize?: number, filters?: { [key: string]: string }, orderByFieldName?: string) {
    if (path.length === 0) {
      throw new Error('path must contain more than 0 elements');
    }
    if (pageSize && pageSize <= 0) {
      throw new Error('pageSize must be more than 0');
    }
    const paths = path.indexOf('/') > 0 ? path.split('/') : [path];
    let collection;
    let collectionPath;
    paths.forEach((c, i) => {
      if (i === 0) {
        collection = this.afs.collection(c);
        collectionPath = firebase.firestore().collection(c);
      } else {
        if (i % 2 === 0) {
          collection = collection.collection(c);
          collectionPath = collectionPath.collection(c);
        } else {
          collection = collection.doc(c);
          collectionPath = collectionPath.doc(c);
        }
      }
    });
    this.collection = collection;
    this.collectionPath = collectionPath;
    this.pageSize = pageSize;
    if (filters) {
      this.filters = filters;
    }
    this.orderByFieldName = orderByFieldName || (pk === 'id' ? 'wid' : pk);
  }

  /**
   * reset the pagination
   */
  reset() {
    this.last =
      this.pageSize =
        this.filters =
          this.collection =
            this.orderByFieldName =
              this.collectionName = null;
    this.hasNextPage = true;
  }

  /**
   * check if there is a new page
   *
   * @returns {boolean}
   */
  hasNext(): boolean {
    return this.hasNextPage;
  }

  getObject(id: string): Promise<T> {
    return this.collection.doc(id).ref.get()
      .then((doc) => {
        if (doc.exists) {
          return this.modelConstructor().map(doc.data());
        } else {
          throw new Error('User not found');
        }
      })
      .catch((error) => {
        throw this.handleError(error);
      });
  }

  /**
   * get next page if exists
   *
   * @returns {Promise<T[]>}
   */
  nextPage(): Promise<T[]> {
    let query = this.collectionPath.limit(this.pageSize);
    const filtersList = this.filters ? Object.keys(this.filters) : [];
    if (this.filters && filtersList.length > 0) {
      Object.keys(this.filters).forEach(k => {
        console.log(k, this.filters[k]);
        let key;
        let optStr;
        const operators = ['>=', '>', '<=', '<', 'array-contains'];
        for (let i = 0; i < operators.length; i++) {
          if (k.indexOf(operators[i]) === 0) {
            key = k.substr(operators[i].length);
            optStr = operators[i];
            this.orderByFieldName = key;
            i = operators.length;
          } else {
            i++;
          }
        }
        if (!key) {
          key = k;
          optStr = '==';
        }
        query = query.where(key, optStr, this.filters[k]);
      });
    }
    query = query.orderBy(this.orderByFieldName);
    if (this.last) {
      query = query.startAfter(this.last);
    }
    return query.get().then(snapshot => {
      const list = [];
      if (snapshot.docs.length > 0) {
        snapshot.docs.forEach((doc) => {
          list.push(this.modelConstructor().map(doc.data()));
        });
        this.last = snapshot.docs[snapshot.docs.length - 1];
        if (list.length < this.pageSize) {
          this.hasNextPage = false;
        }
      } else {
        this.hasNextPage = false;
      }
      return list;
    }).catch((error) => {
      throw this.handleError(error);
    });
  }

  postObject(object: T): Promise<boolean> {
    let o;
    console.log('this.collection', this.collection, this.collection.ref, this.collection.ref.doc());
    if (!object[pk]) {
      o = this.collection.ref.doc();
      object[pk] = o[pk];
    } else {
      o = this.collection.doc(object[pk]);
    }
    return o.set(object.mapReverse()).then(() => {
      return true;
    }).catch((error) => {
      throw this.handleError(error);
    });
  }

  /**
   * post any type of data
   *
   * @param {string} url
   * @param data
   * @returns {Promise<any>}
   */
  postData(url: string, data: any): Promise<any> {
    return axios.post(url, data, this.getHeader())
      .then(response => {
        console.log(response);
        return response.data;
      })
      .catch(error => {
        throw this.handleError(error);
      });
  }

  patchObject(object: T): Promise<boolean> {
    console.log('body', object);
    const docRef = this.collection.doc(object[primaryKey]).ref;
    return docRef.update(object.mapReverse()).then(() => {
      return true;
    }).catch((error) => {
      throw this.handleError(error);
    });
  }

  deleteObject(id: string): Promise<boolean> {
    return this.collection.doc(id).delete().then(() => {
      return true;
    }).catch((error) => {
      throw this.handleError(error);
    });
  }

  /**
   * handle error to return to the component
   *
   * @param error
   * @returns {ResponseError}
   */
  handleError(error: any): ResponseError {
    return new ResponseError(error.code, error.message);
  }
}
