import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Signal,
  inject,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { LayoutComponent } from '../../../core/containers/layout/layout.component';
import { DynamicTableOfContentDirective } from '../../../shared/directives/table-of-content.directive';
import { Post } from '../../../shared/models/post.model';
import { PostFacade } from './post.facade';
import { FeedbackComponent } from './ui/feedback/feedback.component';
import { PostContentComponent } from './ui/post-content/post-content.component';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [
    LayoutComponent,
    DynamicTableOfContentDirective,
    PostContentComponent,
    AsyncPipe,
    FeedbackComponent,
    RouterLink,
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostComponent {
  @Input('id') set pathId(id: string) {
    this.post = this.postFacade.getPost(+id);
  }
  private postFacade = inject(PostFacade);

  public post: Signal<Post | null>;
}
