import {FormControlList, FormControlType} from '../../../@core/models/FormControlTypes';

export class UserDataFactory {

  /**
   * Call this method to get a FormControlList array (containing form element data).
   *
   * @param {*} that - An object which can be used to initialize values in the returned FormControlList.
   * @param {FormControlList} customControlList A FormControlList passed by the user.
   * @return {FormControlList} customControlList concatenated with a FormControlList generated automatically using the 'winkit angular update detail <name>' command.
   */
  static getFormControls = (that: any, customControlList: FormControlList = []): FormControlList => {
    const generatedFormControls: FormControlList = [
      {name: 'id', disabled: true, type: FormControlType.TEXT, order: 0, ngIf: !that.isNew},
      {name: 'userRole', required: true, type: FormControlType.SELECT, options: that.userRoles, disabled: that.loadingList.user, inputFeedbackText: 'Provide valid role', order: 2},
      {name: 'firstName', required: true, type: FormControlType.TEXT, disabled: that.loadingList.user, inputFeedbackText: 'Provide valid first name', order: 3},
      {name: 'lastName', required: true, type: FormControlType.TEXT, disabled: that.loadingList.user, inputFeedbackText: 'Provide valid last name', order: 4},
      {name: 'description', type: FormControlType.TEXTAREA, disabled: that.loadingList.user, wrapperClass: 'col-sm-12 mb-3', order: 8},
      {name: 'email', required: true, type: FormControlType.EMAIL, disabled: that.loadingList.user, pattern: that.globals.getEmailRegex(), inputFeedbackText: 'Provide valid email', readonly: !that.isNew || that.loadingList.user, inputFeedbackExample: 'john@doe.com', order: 9},
      {name: 'telephone', required: true, type: FormControlType.TEXT, disabled: that.loadingList.user, inputFeedbackText: 'Provide valid phone number', order: 6},
      {name: 'profileImg', type: FormControlType.MEDIA, allowedTypes: that.imageAllowedTypes, disabled: that.loadingList.user, wrapperClass: 'col-sm-12 mb-3', order: -1},
      {name: 'isMale', labelText: 'Gender', required: true, type: FormControlType.SELECT, options: that.genders, disabled: that.loadingList.user, wrapperClass: 'col-sm-12 col-md-6 mb-3', innerWrapperClass: 'full-width padding0', inputFeedbackText: 'Provide valid gender', order: 5}
    ];

    return customControlList.concat(generatedFormControls);
  }

}
