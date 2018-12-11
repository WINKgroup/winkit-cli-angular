import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {Observable} from 'rxjs';

/**
 * use this service if you want to send messages from a component to others
 */
@Injectable()
export class MessageService {
  static LOGGED_IN_USER_UPDATED = 'LOGGED_IN_USER_UPDATED';

  private subject = new Subject<any>();

  /**
   * send new message
   *
   * @param {string} message
   */
  sendMessage(message: string) {
    this.subject.next({text: message});
  }

  /**
   * clear message after read it
   */
  clearMessage() {
    this.subject.next();
  }

  /**
   * get the message
   *
   * @returns {Observable<any>}
   */
  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }
}
