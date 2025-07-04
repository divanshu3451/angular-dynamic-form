export type FieldType =
  | 'text'
  | 'number'
  | 'email'
  | 'password'
  | 'textarea'
  | 'select'
  | 'checkbox'
  | 'radio'
  | 'date'
  | 'file'
  | 'image'
  | 'color'
  | 'range'
  | 'toggle'
  | 'formtitle'
  | 'date-range';

export interface FieldOption {
  label: string;
  value: any;
}

export interface FieldConfig {
  type: FieldType;
  label: string;
  name: string;
  placeholder?: string;
  dateRangePickerPlaceholder?: { start: string; end: string };
  value?: any;
  required?: boolean;
  disabled?: boolean;
  validation?: {
    //These are for text fields
    minLength?: number;
    maxLength?: number;

    pattern?: string | RegExp;

    //These are for number fields like age
    min?: number;
    max?: number;

    //These are for datepicker - Can be Date or ISO string
    minDate?: Date | string;
    maxDate?: Date | string;

    startDate?: Date | string; //Can be used for date range default
    endDate?: Date | string; // Default end date

    //These are for files/images validation
    maxFileSize?: number;
    allowedTypes?: string[];

    //These are for date ranges
    minRangeDays?: number; // Minimum allowed range (e.g., 7 for one week)
    maxRangeDays?: number; // Maximum allowed range (e.g., 30 for one month)
  };
  options?: FieldOption[];
  multiple?: boolean;
  accept?: string;
  styles?: {
    titleSize?: string;
    color?: string;
  };
}
