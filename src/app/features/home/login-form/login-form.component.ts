import { Component, DestroyRef, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { LoginService } from '../../../login.service';
import { ErrorService } from '../../../shared/error.service';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css',
})
export class LoginFormComponent {
  private readonly loginService = inject(LoginService);
  private readonly errorService = inject(ErrorService);
  destroyRef = inject(DestroyRef);
  isLoading = signal<boolean>(false);
  loginFailed = signal<boolean>(false);
  errorMsg = signal('');

  form = new FormGroup({
    email: new FormControl<string>('', {
      validators: [Validators.email, Validators.required],
    }),
    password: new FormControl('', {
      validators: [Validators.required, Validators.minLength(5)],
    }),
  });

  onSubmit(): void {
    if (this.form.valid) {
      this.isLoading.set(true);
      const enteredEmail = this.form.controls.email.value!;
      const enteredPassword = this.form.controls.password.value!;

      const subscription = this.loginService
        .logIn(enteredEmail, enteredPassword)
        .subscribe({
          next: (res) => {
            this.errorMsg.set('');
            window.localStorage.setItem(
              'foodora-login-token',
              JSON.stringify(res.token)
            );
          },
          error: (err) => {
            this.loginFailed.set(true);
            this.errorMsg.set(err);

            this.isLoading.set(false);
          },
          complete: () => {
            this.isLoading.set(false);
          },
        });

      this.destroyRef.onDestroy(() => subscription.unsubscribe());
    }
  }

  get invalidCredentials() {
    return (
      this.form.controls.email.touched &&
      this.form.controls.email.dirty &&
      this.form.controls.email.invalid &&
      this.form.controls.password.touched &&
      this.form.controls.password.dirty &&
      this.form.controls.password.invalid
    );
  }
}
