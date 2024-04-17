import { Injectable, Signal, WritableSignal, signal } from '@angular/core';
import { Post } from '../../shared/models/post.model';

@Injectable({
  providedIn: 'root',
})
export class PostsStore {
  private posts: WritableSignal<Post[]> = signal([]);
  private allPostIsLoaded: WritableSignal<'loaded' | 'unloaded'> = signal('unloaded');
  private selectedPost: WritableSignal<Post | null> = signal(null);

  setPosts(posts: Post[]) {
    this.posts.set(posts);
  }

  getPosts(): Signal<Post[]> {
    return this.posts.asReadonly();
  }

  addPost(post: Post) {
    this.posts.update((posts) => [post, ...posts]);
  }

  setSelectedPost(post: Post) {
    this.selectedPost.set(post);
  }

  getSelectedPost(): Signal<Post | null> {
    return this.selectedPost.asReadonly();
  }

  getStatuOfLoadedPosts(): Signal<'loaded' | 'unloaded'> {
    return this.allPostIsLoaded.asReadonly();
  }
  setStatuOfLoadedPostsTrue() {
    this.allPostIsLoaded.set('loaded');
  }
}
