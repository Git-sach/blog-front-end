import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Post } from '../../shared/interfaces/post.interface';

@Injectable({
  providedIn: 'root',
})
export class PostsStore {
  private posts$: BehaviorSubject<Post[]> = new BehaviorSubject<Post[]>([]);
  private selectedPost$: BehaviorSubject<Post | null> =
    new BehaviorSubject<Post | null>(null);

  setPosts(posts: Post[]) {
    this.posts$.next(posts);
  }

  getPosts$(): Observable<Post[]> {
    return this.posts$.asObservable();
  }

  setSelectedPost(post: Post) {
    this.selectedPost$.next(post);
  }

  getSelectedPost(): Observable<Post | null> {
    return this.selectedPost$.asObservable();
  }
}
