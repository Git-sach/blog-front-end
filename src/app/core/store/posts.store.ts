import { Injectable, Signal, WritableSignal, signal } from '@angular/core';
import { Post } from '../../shared/interfaces/post.interface';

@Injectable({
  providedIn: 'root',
})
export class PostsStore {
  private posts: WritableSignal<Post[]> = signal([]);
  private allPostIsLoaded: WritableSignal<boolean> = signal(false);
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

  getStatuOfLoadedPosts(): Signal<boolean> {
    return this.allPostIsLoaded.asReadonly();
  }
  setStatuOfLoadedPostsTrue() {
    this.allPostIsLoaded.set(true);
  }
}
