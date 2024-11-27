import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _isLoggedIn = signal<boolean>(false);

  get isLoggedIn() {
    return this._isLoggedIn;
  }

  login(token: string): void {
    window.localStorage.setItem('foodora-login-token', token);
    this._isLoggedIn.set(true);
  }

  logout(): void {
    window.localStorage.removeItem('foodora-login-token');
    this._isLoggedIn.set(false);
  }

  checkLoggedIn(): void {
    const token = window.localStorage.getItem('foodora-login-token');
    this._isLoggedIn.set(!!token);
  }
}
