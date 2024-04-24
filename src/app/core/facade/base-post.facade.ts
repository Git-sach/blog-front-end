import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Post } from '../../shared/models/post.model';
import { PostsHttpService } from '../http/posts-http.service';
import { PostsStore } from '../store/posts.store';

/**
 * Base Facade for the Post
 */
@Injectable({
  providedIn: 'root',
})
export class BasePostFacade {
  postsHttp = inject(PostsHttpService);
  postStore = inject(PostsStore);

  //TODO: rename ? Mettre dans un intersepteur ?
  public getPost$(id: number): Observable<Post | null> {
    this.postStore.postIsLoaded(id) ? this.postStore.setSelectedPost(id) : this.loadPostAndSetSelectedPost(id);
    return this.postStore.getSelectedPost$();
  }

  // Le add post sera utile dans le cas ou nous passerons de posts en posts avec les sugestions
  // pour ne pas charger necessairement tous les posts
  private loadPostAndSetSelectedPost(id: number) {
    this.postsHttp.getPost$(id).subscribe((post) => {
      this.postStore.addPost(post);
      this.postStore.setSelectedPost(id);
    });
  }
}
