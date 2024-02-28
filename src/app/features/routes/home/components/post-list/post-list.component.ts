import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Post } from '../../../../../shared/interfaces/post.interface';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostListComponent {
  @Input({ required: true }) posts: Post[] | null;
  @Output() clickPostEmitter = new EventEmitter();

  onClick(post: Post) {
    this.clickPostEmitter.emit(post);
  }
}
