import {IndividualConfig, ToastrService} from 'ngx-toastr';

export class CustomNotification {
  /**
   * show notification for every type of message
   *
   * @param {ToastrService} toastr
   * @param {string} title
   * @param {string} message
   * @param {CustomNotificationType} notificationType
   * @param {CustomNotificationDuration} duration
   */
  static showNotification(toastr: ToastrService, title: string, message: string, notificationType: CustomNotificationType, duration: CustomNotificationDuration): void {
    const time = {verySlow: 500, slow: 2000, medium: 3000, long: 4000, veryLong: 5000};
    switch (notificationType) {
      case CustomNotificationType.SUCCESS:
        toastr.success(message, title, {timeOut: time[duration], closeButton: true} as IndividualConfig);
        break;
      case CustomNotificationType.DANGER:
        toastr.error(message, title, {timeOut: time[duration], closeButton: true} as IndividualConfig);
        break;
      case CustomNotificationType.WARNING:
        toastr.warning(message, title, {timeOut: time[duration], closeButton: true} as IndividualConfig);
        break;
      case CustomNotificationType.INFO:
        toastr.info(message, title, {timeOut: time[duration], closeButton: true} as IndividualConfig);
        break;
    }
  }
}

export enum CustomNotificationType {
  INFO = 'info' as any,
  SUCCESS = 'success' as any,
  WARNING = 'warning' as any,
  DANGER = 'danger' as any,
}

export enum CustomNotificationDuration {
  VERY_SLOW = 'verySlow' as any,
  SLOW = 'slow' as any,
  MEDIUM = 'medium' as any,
  LONG = 'long' as any,
  VERY_LONG = 'veryLong' as any
}

export enum CustomNotificationDirection {
  TOP = 'top' as any,
  RIGHT = 'right' as any,
  BOTTOM = 'bottom' as any,
  LEFT = 'left' as any
}
