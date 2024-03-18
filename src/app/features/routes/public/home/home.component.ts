import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Signal,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';
import { LayoutComponent } from '../../../../core/containers/layout/layout.component';
import { Post } from '../../../../shared/interfaces/post.interface';
import { PostListComponent } from './components/post-list/post-list.component';
import { HomeFacade } from './home.facade';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [PostListComponent, LayoutComponent, AsyncPipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  private homeFacade = inject(HomeFacade);
  private router = inject(Router);

  public posts: Signal<Post[]> = this.homeFacade.getPosts();

  public selectPost(post: Post) {
    this.router.navigate(['/post', post.id]);
  }
}
