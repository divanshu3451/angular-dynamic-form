import {
  ChangeDetectionStrategy,
  Component,
  input,
  OnInit,
} from '@angular/core';
import { FieldConfig } from '../models/field';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DynamicFormValidatorService } from './dynamic-form-validator.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MatNativeDateModule,
} from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DDMMYYYY_DATE_FORMAT, toDDMMYYYY } from '../utils/datepicker';

@Component({
  selector: 'app-dynamic-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatRadioModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: DDMMYYYY_DATE_FORMAT },
  ],
  templateUrl: './dynamic-form.component.html',
  styleUrl: './dynamic-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicFormComponent implements OnInit {
  fields = input.required<FieldConfig[]>();
  form!: FormGroup;
  private titleStylesCache = new Map<FieldConfig, any>();

  constructor(
    private formBuilder: FormBuilder,
    private validatorService: DynamicFormValidatorService,
  ) {}

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
    const validators = this.validatorService.getValidatorsForField(field);

    return this.formBuilder.control(
      {
        value: field.value ?? '',
        disabled: field.disabled ?? false,
      },
      validators,
    );
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

  getDateErrorsForTemplate(fieldName: string, field: FieldConfig): string {
    if (
      this.form.get(fieldName)?.hasError('required') &&
      !this.form.get(fieldName)?.hasError('matDatepickerParse')
    ) {
      return `${field.label} is required`;
    }
    if (this.form.get(fieldName)?.hasError('minDate')) {
      return `Date must be after ${toDDMMYYYY(field.validation?.minDate)}`;
    }
    if (this.form.get(fieldName)?.hasError('maxDate')) {
      return `Date must be before ${toDDMMYYYY(field.validation?.maxDate)}`;
    }
    if (this.form.get(fieldName)?.hasError('matDatepickerParse')) {
      return `Invalid date format (DD/MM/YYYY)`;
    }
    return '';
  }


}
