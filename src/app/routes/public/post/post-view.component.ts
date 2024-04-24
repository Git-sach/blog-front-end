import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { Post } from '../../../shared/models/post.model';
import { PostDisplayComponent } from '../../../shared/ui/post-display.component';
import { PostFacade } from './post.facade';
/**
 * Smart Component for post view feature
 * @argument id The id of post
 */
@Component({
  selector: 'app-post-view',
  standalone: true,
  imports: [PostDisplayComponent, RouterLink, AsyncPipe],
  template: `
    @if(post | async; as post) {
    <app-post-display [post]="post"></app-post-display>
    }
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostViewComponent {
  @Input({ required: true }) set id(id: string) {
    this.post = this.postFacade.getPost$(+id);
  }
  public post: Observable<Post | null>;

  postFacade = inject(PostFacade);
}
