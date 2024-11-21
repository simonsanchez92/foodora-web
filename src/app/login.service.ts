import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ErrorService } from './shared/error.service';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private httpClient = inject(HttpClient);
  private errorService = inject(ErrorService);

  logIn(email: string, password: string) {
    return this.httpClient
      .post<{ token: string }>('http://challenge-react.alkemy.org/', {
        email,
        password,
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => new Error(error.error['error']));
        })
      );
  }
}
