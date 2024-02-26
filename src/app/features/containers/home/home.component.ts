import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LayoutComponent } from '../../../core/containers/layout/layout.component';
import { Post } from '../../../shared/interfaces/post.interface';
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
export class HomeComponent implements OnInit {
  private homeFacade = inject(HomeFacade);
  private router = inject(Router);

  public posts$: Observable<Post[]> = this.homeFacade.getPosts$();

  ngOnInit(): void {
    this.homeFacade.loadPosts();
  }

  public selectPost(id: number) {
    this.homeFacade.setSelectedPost(id);
    this.router.navigate(['/post', id]);
  }
}
