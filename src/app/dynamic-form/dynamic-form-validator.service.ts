import { Injectable } from '@angular/core';
import {
  AbstractControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { FieldConfig } from '../models/field';

@Injectable({
  providedIn: 'root',
})
export class DynamicFormValidatorService {
  dateBoundaryValidator(config?: {
    checkInvalid?: boolean;
    minDate?: string | Date;
    maxDate?: string | Date;
  }): ValidatorFn {
    const minDate = config?.minDate ? new Date(config.minDate) : null;
    const maxDate = config?.maxDate ? new Date(config.maxDate) : null;

    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;

      const date = new Date(value);
      const x = { minDate: false, maxDate: false, invalidDate: false };
      if (config?.checkInvalid && isNaN(date.getTime())) x.invalidDate = true;
      if (minDate && date < minDate) x.minDate = true;
      if (maxDate && date > maxDate) x.maxDate = true;

      return x;
    };
  }

  validateDateRange(
    fields: FieldConfig[],
    form: FormGroup,
  ): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const start = group.get('start')?.value;
      const end = group.get('end')?.value;
      // Find the field configuration by looking through all fields
      let field: FieldConfig | undefined;
      for (const f of fields) {
        if (form.get(f.name) === group) {
          field = f;
          break;
        }
      }
      if (!start || !end) return null;
      const startDate = new Date(start);
      const endDate = new Date(end);
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return { invalidDates: true };
      }
      if (startDate > endDate) {
        return { invalidRange: true };
      }
      if (field?.validation?.minRangeDays || field?.validation?.maxRangeDays) {
        const daysDiff = Math.ceil(
          (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
        );
        if (
          field.validation.minRangeDays &&
          daysDiff < field.validation.minRangeDays
        ) {
          return {
            minRangeDays: {
              required: field.validation.minRangeDays,
              actual: daysDiff,
            },
          };
        }
        if (
          field.validation.maxRangeDays &&
          daysDiff > field.validation.maxRangeDays
        ) {
          return {
            maxRangeDays: {
              required: field.validation.maxRangeDays,
              actual: daysDiff,
            },
          };
        }
      }
      return null;
    };
  }

  getValidatorsForField(field: FieldConfig): ValidatorFn[] {
    const validators: ValidatorFn[] = [];
    if (!field.validation) return validators;
    const v = field.validation;
    if (field.required) {
      validators.push(Validators.required);
    }
    if (field.type === 'date' || field.type === 'date-range') {
      validators.push(
        this.dateBoundaryValidator({
          checkInvalid: true,
          minDate: v.minDate,
          maxDate: v.maxDate,
        }),
      );
    }
    if (v.minLength) validators.push(Validators.minLength(v.minLength));
    if (v.maxLength) validators.push(Validators.maxLength(v.maxLength));
    if (v.pattern) validators.push(Validators.pattern(v.pattern));
    if (v.min != null) validators.push(Validators.min(v.min));
    if (v.max != null) validators.push(Validators.max(v.max));
    return validators;
  }
}
