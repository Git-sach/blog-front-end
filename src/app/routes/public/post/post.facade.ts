import { Injectable, Signal, inject } from '@angular/core';
import { PostsHttpService } from '../../../core/http/posts-http.service';
import { PostsStore } from '../../../core/store/posts.store';
import { Post } from '../../../shared/models/post.model';

/**
 * Facade for the Post page
 */
@Injectable({
  providedIn: 'root',
})
export class PostFacade {
  postsHttp = inject(PostsHttpService);
  postStore = inject(PostsStore);

  //TODO: rename ? Mettre dans un intersepteur ?
  public getPost(id: number): Signal<Post | null> {
    const post = this.postStore
      .getPosts()()
      .find((post) => post.id == id);

    post
      ? this.postStore.setSelectedPost(post)
      : this.loadPostAndSetSelecedPost(id);

    return this.postStore.getSelectedPost();
  }

  // Le add post sera utile dans le cas ou nous passerons de posts en posts avec les sugestions
  // pour ne pas charger necessairement tous les posts
  private loadPostAndSetSelecedPost(id: number) {
    this.postsHttp.getPost(id).subscribe((post) => {
      this.postStore.addPost(post);
      this.postStore.setSelectedPost(post);
    });
  }
}
