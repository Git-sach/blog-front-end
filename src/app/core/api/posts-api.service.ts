import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Post } from '../../shared/models/post.model';

@Injectable({
  providedIn: 'root',
})
export class PostsApiService {
  private http = inject(HttpClient);

  readonly baseUrl = environment.blogBaseUrl;

  //TODO: faire le décorateur adapteur pour le maper a un post (valueObject)
  // Déplacer le Mapper et mettre les propriétes en private avec setters et getters
  // faire un service pour mettres les mappers
  @Adapter(postsMapper)
  getPosts(): Observable<Post[]> {
    return this.http.get<any[]>(`${this.baseUrl}/posts`);
  }

  @Adapter(postMapper)
  getPost(id: number): Observable<Post> {
    return this.http.get<any>(`${this.baseUrl}/post/${id}`);
  }
}

export function Adapter(adapterFn: any) {
  return function (
    target: PostsApiService,
    propertyKey: string,
    descriptor: any
  ) {
    let originalMethod = descriptor.value;

    descriptor.value = function (...args: any) {
      let returnValue = originalMethod.apply(this, args).pipe(map(adapterFn));
      return returnValue;
    };

    return descriptor;
  };
}

export function postMapper(post: any) {
  const keywords: string[] = post.keywords.map((keyword: any) => keyword.name);
  return new Post(
    post.id,
    post.title,
    post.resum,
    post.content,
    post.coverImagePath,
    keywords,
    post.readTime,
    post.date
  );
}

export function postsMapper(posts: any) {
  return posts.map(postMapper);
}
