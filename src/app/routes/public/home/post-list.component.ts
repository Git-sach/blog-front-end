import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Post } from '../../../shared/models/post.model';
import { PostCardComponent } from '../../../shared/ui/post-card.component';
import { HomeFacade } from './home.facade';

/**
 * Smart Component for list of post cards
 */
@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [DatePipe, PostCardComponent],
  template: `
    <div class="posts">
      @for (post of posts(); track post.id) {
      <app-post-card (clickPostEmitter)="selectPost(post)" [post]="post"></app-post-card>
      }
    </div>
  `,
  styles: `
  .posts {
    display: flex;
    gap: 50px;
    width: 100%;
    justify-content: space-between;
    flex-wrap: wrap;
  }
  
  @media screen and (max-width: 725px) {
    .posts {
      justify-content: center;
    }
  }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostListComponent {
  private homeFacade = inject(HomeFacade);
  private router = inject(Router);

  public posts: Signal<Post[]> = this.homeFacade.getPosts();

  public selectPost(post: Post) {
    this.router.navigate(['/post', post.id]);
  }
}
