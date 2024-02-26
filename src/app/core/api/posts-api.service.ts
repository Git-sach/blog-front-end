import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { POST_MOCK } from '../mocks/posts.mock';

@Injectable({
  providedIn: 'root',
})
export class PostsApiService {
  private http = inject(HttpClient);

  //TODO: faire le décorateur adapteur pour le maper a un post (valueObject)
  getPosts(): Observable<any> {
    return of(POST_MOCK);
  }

  getPost(id: number): Observable<any> {
    return of(POST_MOCK[0]);
  }
}
