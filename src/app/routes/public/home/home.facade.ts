import { Injectable, Signal, inject } from '@angular/core';
import { PostsHttpService } from '../../../core/http/posts-http.service';
import { PostsStore } from '../../../core/store/posts.store';
import { Post } from '../../../shared/models/post.model';

@Injectable({
  providedIn: 'root',
})
export class HomeFacade {
  postStore = inject(PostsStore);
  postsHttp = inject(PostsHttpService);

  public getPosts(): Signal<Post[]> {
    if (this.postStore.getStatuOfLoadedPosts()() === 'unloaded') {
      this.loadPosts();
    }
    return this.postStore.getPosts();
  }

  private loadPosts(): void {
    this.postsHttp.getPosts().subscribe((posts) => {
      this.postStore.setPosts(posts);
    });
    this.postStore.setStatuOfLoadedPostsTrue();
  }
}
