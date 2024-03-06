import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { PostsApiService } from '../../../../core/api/posts-api.service';
import { Post } from '../../../../shared/interfaces/post.interface';

@Injectable({
  providedIn: 'root',
})
export class PostViewFacade {
  postsApi = inject(PostsApiService);

  public getPost(id: number): Observable<Post> {
    return this.postsApi.getPost(id);
  }
}
