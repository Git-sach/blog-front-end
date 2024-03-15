import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  input,
} from '@angular/core';
import { Post } from '../../../../../../shared/interfaces/post.interface';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostListComponent {
  posts = input.required<Post[]>();
  @Output() clickPostEmitter = new EventEmitter();

  onClick(post: Post) {
    this.clickPostEmitter.emit(post);
  }
}
