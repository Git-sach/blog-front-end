import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthStore {
  private _authToken = '';
  private _previousUrl = '';

  get authToken() {
    return this._authToken;
  }

  set authToken(token: string) {
    this._authToken = token;
  }

  set previousUrl(url: string) {
    this._previousUrl = url;
  }

  get previousUrl() {
    return this._previousUrl;
  }
}
