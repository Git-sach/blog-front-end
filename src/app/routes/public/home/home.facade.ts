import { Injectable, Signal, inject } from '@angular/core';
import { PostsApiService } from '../../../core/api/posts-api.service';
import { PostsStore } from '../../../core/store/posts.store';
import { Post } from '../../../shared/models/post.model';

@Injectable({
  providedIn: 'root',
})
export class HomeFacade {
  postStore = inject(PostsStore);
  postsApi = inject(PostsApiService);

  public getPosts(): Signal<Post[]> {
    if (!this.postStore.getStatuOfLoadedPosts()()) {
      this.loadPosts();
    }
    return this.postStore.getPosts();
  }

  private loadPosts(): void {
    this.postsApi.getPosts().subscribe((posts) => {
      this.postStore.setPosts(posts);
    });
    this.postStore.setStatuOfLoadedPostsTrue();
  }
}
