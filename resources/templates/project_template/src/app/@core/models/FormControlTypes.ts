import {MediaType} from '../../shared/components/media-manager/Media';

export enum FormControlType {
  TEXT = 'text',
  NUMBER = 'number',
  DATE = 'date',
  PASSWORD = 'password',
  SELECT = 'select',
  TEXTAREA = 'textarea',
  DATEPICKER = 'datePicker',
  MEDIA = 'media',
  EMAIL = 'email'
}

export interface BaseFormControl {
  name: string;
  type: FormControlType;
  primaryKey?: true;
  ngIf?: boolean;
  order?: number;
  labelText?: string;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  pattern?: string;
  wrapperClass?: string;
  innerWrapperClass?: string;
  inputFeedbackText?: string;
  inputFeedbackExample?: string;
}

export interface FormControlGeneric extends BaseFormControl {
  type: FormControlType.TEXT | FormControlType.NUMBER | FormControlType.DATE | FormControlType.PASSWORD | FormControlType.DATEPICKER| FormControlType.EMAIL;
}

export interface FormControlSelect extends BaseFormControl {
  type: FormControlType.SELECT;
  options: any[];
}

export interface FormControlMedia extends BaseFormControl {
  type: FormControlType.MEDIA;
  allowedTypes: MediaType[];
}

export interface FormControlTextArea extends BaseFormControl {
  type: FormControlType.TEXTAREA;
  rows?: number;
}

export type FormControlList = Array<FormControlGeneric | FormControlSelect | FormControlMedia | FormControlTextArea>;
