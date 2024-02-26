import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Post } from '../../../../../shared/interfaces/post.interface';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostComponent {
  @Input({ required: true }) post: Post | null;
}
