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

  // TODO: Gérer le header dans un intersepteur ou un decorateur
  public login(username: string, password: string): Observable<string> {
    const headers = new HttpHeaders({
      Authorization: 'Basic ' + btoa(username + ':' + password),
    });
    return this.http.post<string>(`${this.baseUrl}/login`, {}, { headers });
  }
}
