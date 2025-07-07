import {
  ChangeDetectionStrategy,
  Component,
  input,
  OnInit,
} from '@angular/core';
import { FieldConfig, FieldType } from '../models/field';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatRadioModule } from '@angular/material/radio';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MatNativeDateModule,
  provideNativeDateAdapter,
} from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import {
  CUSTOM_DATE_FORMATS,
  CustomDateAdapterService,
} from '../datepicker/custom-date-adapter.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-dynamic-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSlideToggleModule,
    MatRadioModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
  ],
  providers: [
    provideNativeDateAdapter(),
    { provide: DateAdapter, useClass: CustomDateAdapterService },
    { provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }, //Sets locale to dd/mm/yyyy
  ],
  templateUrl: './dynamic-form.component.html',
  styleUrl: './dynamic-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicFormComponent implements OnInit {
  fields = input.required<FieldConfig[]>();
  form!: FormGroup;
  private titleStylesCache = new Map<FieldConfig, any>();

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.createForm();
  }

  private createForm(): FormGroup {
    const group = this.formBuilder.group({});
    this.fields().forEach((field) => {
      const control =
        field.type === 'date-range'
          ? this.createDateRangeControl(field)
          : this.createFormControl(field);
      group.addControl(field.name, control);
    });
    return group;
  }

  private createDateRangeControl(field: FieldConfig): FormGroup {
    return this.formBuilder.group(
      {
        start: [field.value?.start || null, this.getValidatorsForField(field)],
        end: [field.value?.end || null, this.getValidatorsForField(field)],
      },
      { validator: this.validateDateRange.bind(this) },
    );
  }

  private validateDateRange(group: AbstractControl): ValidationErrors | null {
    const start = group.get('start')?.value;
    const end = group.get('end')?.value;
    if (!start || !end) return null;
    return new Date(start) > new Date(end) ? { invalidRange: true } : null;
  }

  private createFormControl(field: FieldConfig): FormControl {
    const validators = this.getValidatorsForField(field);

    return this.formBuilder.control(
      {
        value: field.value ?? '',
        disabled: field.disabled ?? false,
      },
      validators,
    );
  }

  private getValidatorsForField(field: FieldConfig): ValidatorFn[] {
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

  private dateBoundaryValidator(config?: {
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

  getTitleStyles(field: FieldConfig) {
    if (!this.titleStylesCache.has(field)) {
      this.titleStylesCache.set(field, {
        'font-size': field.styles?.titleSize || '24px',
        color: field.styles?.color || 'inherit',
      });
    }
    return this.titleStylesCache.get(field);
  }

  getPlaceholder(field: FieldConfig, position: 'start' | 'end'): string {
    if (typeof field.placeholder === 'string') {
      return position === 'start' ? field.placeholder : 'End date';
    }
    return field.placeholder?.[position] || position === 'start'
      ? 'Start date'
      : 'End date';
  }

  validateManualDateInput(event: Event, fieldName: string) {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    if (value) {
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        this.form.get(fieldName)?.setErrors({ invalidDate: true });
      }
    }
  }

  getFieldType(field: FieldConfig): string {
    switch (field.type) {
      case 'number':
        return 'number';
      case 'email':
        return 'email';
      case 'password':
        return 'password';
      case 'color':
        return 'color';
      case 'range':
        return 'range';
      default:
        return 'text';
    }
  }

  onFileChange(event: Event, fieldName: string): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || !input.files.length) return;
    const field = this.fields().find((f) => f.name === fieldName);
    const files = Array.from(input.files);
    const errors: string[] = [];

    files.forEach((file) => {
      if (
        field?.validation?.allowedTypes &&
        !field.validation.allowedTypes.includes(file.type)
      ) {
        errors.push(`Invalid Type: ${file.name}`);
      }

      if (
        field?.validation?.maxFileSize &&
        file.size > field.validation.maxFileSize
      ) {
        const maxSizeMB = field.validation.maxFileSize / (1024 * 1024);
        errors.push(`Too large: ${file.name} (max ${maxSizeMB}MB)`);
      }
    });

    if (errors.length) {
      this.form.get(fieldName)?.setErrors({ fileErrors: errors });
      return;
    }

    files.length === 1
      ? this.form.get(fieldName)?.setValue(files[0])
      : this.form.get(fieldName)?.setValue(files);
  }

  toDate(value: string | Date): Date | null {
    if (!value) return null;
    return typeof value === 'string' ? new Date(value) : value;
  }

  getDateRangeControl(fieldName: string): FormGroup {
    return this.form.get(fieldName) as FormGroup;
  }
}
