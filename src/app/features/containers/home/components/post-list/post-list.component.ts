import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { posts } from '../../../../../core/mocks/posts.mock';
import { Post } from '../../../../../shared/interfaces/post.interface';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.scss',
})
export class PostListComponent {
  // faire value object ?
  postInput: Post[] = posts;
}
