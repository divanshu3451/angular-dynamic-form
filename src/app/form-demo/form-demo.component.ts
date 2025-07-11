import { Component } from '@angular/core';
import { FieldConfig } from '../models/field';
import { DynamicFormComponent } from '../dynamic-form/dynamic-form.component';

@Component({
  selector: 'app-form-demo',
  imports: [DynamicFormComponent],
  templateUrl: './form-demo.component.html',
  styleUrl: './form-demo.component.scss',
})
export class FormDemoComponent {
  formFields: FieldConfig[] = [
    // {
    //   type: 'formtitle',
    //   label: 'User Registration',
    //   name: 'userRegistration',
    //   styles: { titleSize: '28px', color: '#3f51b5' },
    // },
    // {
    //   type: 'text',
    //   label: 'First Name',
    //   name: 'firstName',
    //   required: true,
    //   validation: { minLength: 3, maxLength: 50 },
    // },
    {
      type: 'date',
      label: 'Date of Birth',
      name: 'dob',
      required: true,
      validation: {
        minDate: new Date(1900, 0, 1),
        maxDate: new Date(), // Today // 1-Jan-1900
        startDate: new Date(2025, 0, 1),
      },
    },
    // {
    //   type: 'text',
    //   label: 'Last Name',
    //   name: 'lastName',
    //   required: true,
    //   validation: { minLength: 3, maxLength: 50 },
    // },
    // {
    //   type: 'email',
    //   label: 'Email Address',
    //   name: 'email',
    //   placeholder: 'Enter your Email',
    //   required: true,
    //   validation: {
    //     pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$',
    //   },
    // },
    // {
    //   type: 'password',
    //   label: 'Password',
    //   name: 'password',
    //   placeholder: 'Enter your password',
    //   required: true,
    //   validation: { minLength: 8 },
    // },
    // {
    //   type: 'number',
    //   label: 'Age',
    //   name: 'age',
    //   placeholder: 'Enter your age',
    //   validation: { min: 18, max: 99 },
    // },
    // {
    //   type: 'select',
    //   label: 'Country',
    //   name: 'country',
    //   required: true,
    //   options: [
    //     { label: 'India', value: 'IN' },
    //     { label: 'Pakistan', value: 'PKMKB' },
    //     { label: 'Germany', value: 'GER' },
    //   ],
    // },
    // {
    //   type: 'textarea',
    //   label: 'Bio',
    //   name: 'bio',
    //   placeholder: 'Tell us about yourself',
    //   validation: { maxLength: 500, minLength: 50 },
    // },
    // {
    //   type: 'checkbox',
    //   label: 'Subscribe to newsletter',
    //   name: 'sibscribe',
    //   value: true,
    // },
    // {
    //   type: 'radio',
    //   label: 'Gender',
    //   name: 'gender',
    //   options: [
    //     { label: 'Male', value: 'male' },
    //     { label: 'Female', value: 'female' },
    //     { label: 'Other', value: 'other' },
    //   ],
    // },
    // {
    //   type: 'image',
    //   label: 'Profile Picture',
    //   name: 'profilePicture',
    //   accept: 'image/*',
    //   validation: {
    //     maxFileSize: 2 * 1024 * 1024,
    //     allowedTypes: ['image/jpeg', 'image/png', 'image/jpg'],
    //   },
    // },
    // {
    //   type: 'file',
    //   label: 'Resume',
    //   name: 'resume',
    //   accept: '.pdf,.doc,.docx',
    // },
    {
      type: 'date-range',
      name: 'vacationDates',
      label: 'Vacation Period',
      placeholder: 'Select your vacation dates',
      dateRangePickerPlaceholder: {
        start: 'Start vacation',
        end: 'End vacation',
      },
      required: true,
      validation: {
        minDate: new Date(),
        maxDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        minRangeDays: 3,
        maxRangeDays: 14,
      },
    },
  ];
}
