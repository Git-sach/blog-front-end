import { Injectable } from '@angular/core';
import { Post } from '../../shared/models/post.model';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  public static postMapper(post: any) {
    const keywords: string[] = post.keywords.map(
      (keyword: any) => keyword.name
    );
    return new Post(
      post.id,
      post.title,
      post.resum,
      post.content,
      post.coverImagePath,
      keywords,
      post.readTime,
      post.date
    );
  }

  public static postsMapper(posts: any) {
    return posts.map(PostsService.postMapper);
  }
}
