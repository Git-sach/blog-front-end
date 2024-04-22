import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { LoginHttpService } from '../../../core/http/login-http.service';
import { AuthStore } from '../../../core/store/auth.store';

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Facade for the Login page
 */
@Injectable({
  providedIn: 'root',
})
export class LoginFacade {
  private authStore = inject(AuthStore);
  private loginHttp = inject(LoginHttpService);
  private router = inject(Router);

  /**
   * Manages the user login process.
   * Sends an authentication request with the provided credentials.
   * Stores the authentication token if successful.
   * Redirects the user to the previous URL after login.
   * @param userName The user's username.
   * @param password The user's password.
   * @returns An observable emitting a boolean indicating if authentication failed.
   */
  loginUser(userName: string, password: string): Observable<boolean> {
    //TODO: Faire du local storage
    const isAuthenticationFailed$ = new BehaviorSubject(false);
    this.loginHttp.login(userName, password).subscribe({
      next: (authObject) => {
        this.authStore.localStorageToken = authObject;
        this.router.navigate([this.authStore.previousUrl]);
      },
      error: (err) => {
        console.log(err);
        isAuthenticationFailed$.next(true);
      },
    });
    return isAuthenticationFailed$.asObservable();
  }
}
