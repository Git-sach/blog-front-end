import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LoginHttpService {
  private http = inject(HttpClient);

  readonly baseUrl = environment.blogBaseUrl;

  public login(username: string, password: string): Observable<{ token: string }> {
    const headers = new HttpHeaders({
      Authorization: 'Basic ' + btoa(username + ':' + password),
    });
    return this.http.post<{ token: string }>(`${this.baseUrl}/login`, {}, { headers });
  }
}
