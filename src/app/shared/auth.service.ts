import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private router = inject(Router);
  private _isLoggedIn = signal<boolean>(false);
  private tokenKey = 'foodora-login-token';

  private isLoggedInSubject = new BehaviorSubject<boolean>(
    this.checkLoggedIn()
  );
  get isLoggedIn$() {
    return this.isLoggedInSubject.asObservable();
  }

  login(token: string): void {
    window.localStorage.setItem(this.tokenKey, token);
    this._isLoggedIn.set(true);

    this.isLoggedInSubject.next(true);
  }

  logout(): void {
    window.localStorage.removeItem(this.tokenKey);
    this._isLoggedIn.set(false);

    this.isLoggedInSubject.next(false);
    this.router.navigate(['']);
  }

  checkLoggedIn() {
    const token = window.localStorage.getItem(this.tokenKey);
    this._isLoggedIn.set(!!token);
    return this._isLoggedIn();
  }
}
