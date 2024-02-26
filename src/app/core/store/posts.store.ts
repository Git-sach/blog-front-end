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

  setSelectedPost(id: number) {
    //TODO: Pas faire ca (a qui de savoir si un post est stocké ou non ?) et de faire la logique ??
    const post = this.posts$.value.find((post) => post.id === id);
    this.selectedPost$.next(post!);
  }

  getSelectedPost(): Observable<Post | null> {
    return this.selectedPost$.asObservable();
  }
}
