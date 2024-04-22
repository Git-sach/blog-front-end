import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthStore {
  private _previousUrl = '';
  private _localStorageTimeoutInMs = 1000 * 60 * 60 * 12; //12h
  private _localStorageName = 'authStorage';

  set previousUrl(url: string) {
    this._previousUrl = url;
  }

  get previousUrl() {
    return this._previousUrl;
  }

  // Method to get the authentication token from localStorage
  get localStorageToken(): string | null {
    const authStorage = localStorage.getItem(this._localStorageName);

    if (authStorage) {
      const timeNow = new Date().getTime().toString();
      const timestempAuth = JSON.parse(authStorage).timestemp;

      // Check if the session has expired
      if (timeNow >= timestempAuth + this._localStorageTimeoutInMs) {
        console.log('La session a expiré');
        this.removeStorage();
      } else {
        const tokenAuth = JSON.parse(authStorage).token;
        return tokenAuth;
      }
    }
    return null;
  }

  // Method to set the authentication token in localStorage
  set localStorageToken(authObject: { token: string }) {
    const storageObject = { token: authObject.token, timestemp: new Date().getTime() };
    localStorage.setItem(this._localStorageName, JSON.stringify(storageObject));
  }

  // Method to remove authentication data from localStorage
  private removeStorage() {
    localStorage.removeItem(this._localStorageName);
  }
}
