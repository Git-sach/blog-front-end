import { Injectable, Signal, WritableSignal, signal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Post } from '../../shared/models/post.model';

@Injectable({
  providedIn: 'root',
})
export class PostsStore {
  private posts$: BehaviorSubject<Post[]> = new BehaviorSubject<Post[]>([]);
  private allPostIsLoaded: WritableSignal<'loaded' | 'unloaded'> = signal('unloaded');
  private selectedPost$: BehaviorSubject<Post | null> = new BehaviorSubject<Post | null>(null);

  setPosts(posts: Post[]) {
    this.posts$.next(posts);
  }

  getPosts$(): Observable<Post[]> {
    return this.posts$.asObservable();
  }

  postIsLoaded(id: number): boolean {
    if (this.posts$.value.find((post) => post.id == id)) {
      return true;
    }
    return false;
  }

  addPost(post: Post) {
    const posts = this.posts$.value;
    this.posts$.next([post, ...posts]);
  }

  setSelectedPost(id: number) {
    const post = this.posts$.value.find((posts) => posts.id == id);
    if (post) {
      this.selectedPost$.next(post);
    }
  }

  getSelectedPost$(): Observable<Post | null> {
    return this.selectedPost$.asObservable();
  }

  getStatuOfLoadedPosts(): Signal<'loaded' | 'unloaded'> {
    return this.allPostIsLoaded.asReadonly();
  }
  setStatuOfLoadedPostsTrue() {
    this.allPostIsLoaded.set('loaded');
  }
}
