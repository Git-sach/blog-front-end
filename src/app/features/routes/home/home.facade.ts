import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { PostsApiService } from '../../../core/api/posts-api.service';
import { PostsStore } from '../../../core/store/posts.store';
import { Post } from '../../../shared/interfaces/post.interface';

@Injectable({
  providedIn: 'root',
})
export class HomeFacade {
  postStore = inject(PostsStore);
  postsApi = inject(PostsApiService);

  // TODO: Gérer le faire de ne pas faire cet appèle une fois que les posts sont dans le Store
  public loadPosts(): void {
    this.postsApi.getPosts().subscribe((posts) => {
      this.postStore.setPosts(posts);
    });
  }

  public getPosts$(): Observable<Post[]> {
    return this.postStore.getPosts$();
  }

  public setSelectedPost(post: Post) {
    this.postStore.setSelectedPost(post);
  }
}
