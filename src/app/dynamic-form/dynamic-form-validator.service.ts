import { Injectable } from '@angular/core';
import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { FieldConfig } from '../models/field';

@Injectable({
  providedIn: 'root',
})
export class DynamicFormValidatorService {
  getValidatorsForField(field: FieldConfig): ValidatorFn[] {
    const validators: ValidatorFn[] = [];
    const v = field.validation;
    if (!v) return validators;
    if (
      field.type === 'date' ||
      (field.type === 'date-range' && (v.minDate || v.maxDate))
    )
      validators.push(this.minMaxDateValidator(v.minDate, v.maxDate));

    if (field.required) validators.push(Validators.required);
    if (v.minLength) validators.push(Validators.minLength(v.minLength));
    if (v.maxLength) validators.push(Validators.maxLength(v.maxLength));
    if (v.pattern) validators.push(Validators.pattern(v.pattern));
    if (v.min != null) validators.push(Validators.min(v.min));
    if (v.max != null) validators.push(Validators.max(v.max));
    return validators;
  }

  private minMaxDateValidator(
    minDate?: Date | string,
    maxDate?: Date | string,
  ): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      const valueDate = new Date(control.value);

      if (minDate)
        if (valueDate < new Date(minDate))
          return {
            minDate: { required: new Date(minDate), actual: valueDate },
          };

      if (maxDate)
        if (valueDate > new Date(maxDate))
          return {
            maxDate: { required: new Date(maxDate), actual: valueDate },
          };

      return null;
    };
  }
}
