import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormDemoComponent } from './form-demo/form-demo.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormDemoComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
