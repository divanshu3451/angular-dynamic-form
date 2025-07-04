import {
  ChangeDetectionStrategy,
  Component,
  input,
  OnInit,
} from '@angular/core';
import { FieldConfig } from '../models/field';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
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

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.createForm();
  }

  private createForm(): FormGroup {
    const group = this.formBuilder.group({});
    this.fields().forEach((field) => {
      const control = this.createFormControl(field);
      group.addControl(field.name, control);
    });

    return group;
  }

  private createFormControl(field: FieldConfig): FormControl {
    const validators = [],
      fieldValidation = field.validation;

    if (field.required) {
      validators.push(Validators.required);
    }

    if (field.type === 'date') {
      validators.push((control: AbstractControl) => {
        if (!control.value) return null;
        const date = new Date(control.value);
        return isNaN(date.getTime()) ? { invalidDate: true } : null;
      });
    }

    if (fieldValidation) {
      if (fieldValidation.minLength) {
        validators.push(Validators.minLength(fieldValidation.minLength));
      }
      if (fieldValidation.maxLength) {
        validators.push(Validators.maxLength(fieldValidation.maxLength));
      }
      if (fieldValidation.pattern) {
        validators.push(Validators.pattern(fieldValidation.pattern));
      }
      if (fieldValidation.min) {
        validators.push(Validators.min(fieldValidation.min));
      }
      if (fieldValidation.max) {
        validators.push(Validators.max(fieldValidation.max));
      }
      if (fieldValidation.minDate) {
        const minDate = new Date(fieldValidation.minDate);
        validators.push((control: AbstractControl) =>
          control.value && new Date(control.value) < minDate
            ? { minDate: true }
            : null,
        );
      }
      if (fieldValidation.maxDate) {
        const maxDate = new Date(fieldValidation.maxDate);
        validators.push((control: AbstractControl) =>
          control.value && new Date(control.value) > maxDate
            ? { maxDate: true }
            : null,
        );
      }
    }

    return this.formBuilder.control(
      {
        value: field.value || '',
        disabled: field.disabled || false,
      },
      validators,
    );
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
