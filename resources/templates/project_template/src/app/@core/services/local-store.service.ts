import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';

@Injectable()
export class LocalStoreService {

  constructor() {
  }

  getCachedApiResponse(url: string): { data: any, etag: string } {
    try {
      this.preventLocalStorageMaxUsage();
      const res: { data: any, etag: string } = JSON.parse(localStorage.getItem(url));
      if (res) {
        console.log(`exist cached res for ${url}`, res);
        return res;
      }
    } catch (e) {
      console.error(`Error! Can't get list from localStorage for ${url}`, e);
    }
    return null;
  }

  setCachedApiResponse(url: string, data: any, etag: string): boolean {
    if (data) {
      try {
        this.preventLocalStorageMaxUsage();
        const element = JSON.stringify({data: data, etag: etag});
        localStorage.setItem(url, element);
        console.log(`cached ${url} with etag ${etag}`, data);
        return true;
      } catch (e) {
        return false;
      }
    }
    return false;
  }

  removeCachedApiResponse(url: string): boolean {
    try {
      localStorage.removeItem(url);
      return true;
    } catch (e) {
      return false;
    }
  }

  clear(): boolean {
    try {
      localStorage.clear();
      return true;
    } catch (e) {
      return false;
    }
  }

  preventLocalStorageMaxUsage() {
    let t = 0;
    let i = 0;
    for (const x in localStorage) {
      t += (((localStorage[x].length * 2 || 0)));
      i++;
    }
    let j = 0;
    if (t / 1024 > 1024) {
      for (const x in localStorage) {
        if (x.indexOf(environment.BASE_SERVER_URL) > -1 && j < (i / 2)) {
          localStorage.removeItem(x);
        }
        j++;
      }
    }
  }

}
