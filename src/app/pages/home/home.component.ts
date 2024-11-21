import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { LoginFormComponent } from '../../features/home/login-form/login-form.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [LoginFormComponent, MatCardModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {}
