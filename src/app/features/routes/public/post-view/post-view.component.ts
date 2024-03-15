import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Signal,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';
import { LayoutComponent } from '../../../../core/containers/layout/layout.component';
import { DynamicTableOfContentDirective } from '../../../../shared/directives/table-of-content.directive';
import { Post } from '../../../../shared/interfaces/post.interface';
import { PostComponent } from './components/post/post.component';
import { PostViewFacade } from './post-view.facade';

@Component({
  selector: 'app-post-view',
  standalone: true,
  imports: [
    LayoutComponent,
    DynamicTableOfContentDirective,
    PostComponent,
    AsyncPipe,
  ],
  templateUrl: './post-view.component.html',
  styleUrl: './post-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostViewComponent {
  @Input('id') set pathId(id: string) {
    this.post = this.postViewFacade.getPost(+id);
  }

  private postViewFacade = inject(PostViewFacade);
  private router = inject(Router);

  public post: Signal<Post | null>;

  backHome() {
    this.router.navigate(['/blog']);
  }
}
