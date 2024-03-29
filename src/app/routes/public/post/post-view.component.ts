import { Component, inject, Input, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Post } from '../../../shared/models/post.model';
import { PostDisplayComponent } from '../../../shared/ui/post-display.component';
import { PostFacade } from './post.facade';
/**
 * Smart Component
 */
@Component({
  selector: 'app-post-view',
  standalone: true,
  imports: [PostDisplayComponent, RouterLink],
  template: `
    @if(post(); as post) {
    <app-post-display [post]="post"></app-post-display>
    }
  `,
  styles: ``,
})
export class PostViewComponent {
  @Input({ required: true }) set id(id: string) {
    this.post = this.postFacade.getPost(+id);
  }
  public post: Signal<Post | null>;

  postFacade = inject(PostFacade);
}
