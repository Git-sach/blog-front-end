import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
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
    this.post$ = this.postViewFacade.getPost(+id);
  }

  private postViewFacade = inject(PostViewFacade);
  private router = inject(Router);

  post$: Observable<Post>;

  backHome() {
    this.router.navigate(['/blog']);
  }

  //TODO: Il nous faudra un resolver pour load le product si on arrive directement sur l'url d'un post pour ne pas charger tous les posts
}
