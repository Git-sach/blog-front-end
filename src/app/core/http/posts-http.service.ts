import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Post } from '../../shared/models/post.model';
import { Adapter } from './http.decorator';
import { PostsService } from './posts.service';

@Injectable({
  providedIn: 'root',
})
export class PostsHttpService {
  private http = inject(HttpClient);

  readonly baseUrl = environment.blogBaseUrl;

  @Adapter(PostsService.postsMapper)
  getPosts$(): Observable<Post[]> {
    return this.http.get<any[]>(`${this.baseUrl}/public/posts`);
  }

  @Adapter(PostsService.postMapper)
  getPost$(id: number): Observable<Post> {
    return this.http.get<any>(`${this.baseUrl}/public/post/${id}`);
  }

  creatPost(post: Post, token: string): Observable<Post> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<any>(`${this.baseUrl}/private/post`, post, { headers });
  }

  // private POST_MOCK = POST_MOCK;

  // @Adapter(PostsService.postMapper)
  // getPost$(id: number): Observable<Post> {
  //   return of(this.POST_MOCK[0] as Post);
  // }
}
