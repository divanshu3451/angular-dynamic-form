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
    if (field.required) validators.push(Validators.required);
    if (v.minLength) validators.push(Validators.minLength(v.minLength));
    if (v.maxLength) validators.push(Validators.maxLength(v.maxLength));
    if (v.pattern) validators.push(Validators.pattern(v.pattern));
    if (v.min != null) validators.push(Validators.min(v.min));
    if (v.max != null) validators.push(Validators.max(v.max));
    return validators;
  }
}
