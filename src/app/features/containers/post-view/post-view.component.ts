import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxEditorModule } from 'ngx-editor';
import { Observable, of } from 'rxjs';
import { LayoutComponent } from '../../../core/containers/layout/layout.component';
import { POST_MOCK } from '../../../core/mocks/posts.mock';
import { DynamicTableOfContentDirective } from '../../../shared/directives/table-of-content.directive';
import { Post } from '../../../shared/interfaces/post.interface';
import { PostComponent } from './components/post/post.component';

@Component({
  selector: 'app-post-view',
  standalone: true,
  imports: [
    LayoutComponent,
    NgxEditorModule,
    FormsModule,
    DynamicTableOfContentDirective,
    PostComponent,
    AsyncPipe,
  ],
  templateUrl: './post-view.component.html',
  styleUrl: './post-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostViewComponent {
  post$: Observable<Post> = of(POST_MOCK[0]);

  //TODO: Il nous faudra un resolver pour load le product si on arrive directement sur l'url d'un post pour ne pas charger tous les posts

  // html = this.post.content;
  // editor!: Editor;
  // toolbar: Toolbar = [
  //   // default value
  //   // ['bold', 'italic'],
  //   // ['underline', 'strike'],
  //   ['code', 'blockquote'],
  //   // ['ordered_list', 'bullet_list'],
  //   [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
  //   ['link', 'image'],
  //   // ['text_color', 'background_color'],
  //   ['align_left', 'align_center', 'align_right', 'align_justify'],
  //   ['horizontal_rule', 'format_clear'],
  // ];

  // ngOnInit(): void {
  //   this.editor = new Editor();
  // }

  // ngOnDestroy(): void {
  //   this.editor.destroy();
  // }
}
