import { Injectable } from '@angular/core';
import { MatDateFormats, NativeDateAdapter } from '@angular/material/core';

@Injectable({
  providedIn: 'root',
})
export class CustomDateAdapterService extends NativeDateAdapter {
  override format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      let day = date.getDate().toString();
      day = Number(day) < 10 ? '0' + day : day;
      let month = (date.getMonth() + 1).toString();
      month = Number(month) < 10 ? '0' + month : month;
      let year = date.getFullYear();
      return `${day}-${month}-${year}`;
    }
    return date.toDateString();
  }

  constructor() {
    super();
  }
}

export const CUSTOM_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: { month: 'short', year: 'numeric', day: 'numeric' },
  },
  display: {
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' },
  },
};
