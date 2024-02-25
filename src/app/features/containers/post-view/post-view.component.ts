import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Editor, NgxEditorModule, Toolbar } from 'ngx-editor';
import { LayoutComponent } from '../../../core/containers/layout/layout.component';
import { posts } from '../../../core/mocks/posts.mock';
import { DynamicTableOfContentDirective } from '../../../shared/directives/table-of-content.directive';
import { Post } from '../../../shared/interfaces/post.interface';

@Component({
  selector: 'app-post-view',
  standalone: true,
  imports: [
    DatePipe,
    LayoutComponent,
    NgxEditorModule,
    FormsModule,
    DynamicTableOfContentDirective,
  ],
  templateUrl: './post-view.component.html',
  styleUrl: './post-view.component.scss',
})
export class PostViewComponent implements OnInit {
  post: Post = posts[0];

  html = this.post.content;
  editor!: Editor;
  toolbar: Toolbar = [
    // default value
    // ['bold', 'italic'],
    // ['underline', 'strike'],
    ['code', 'blockquote'],
    // ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    // ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
    ['horizontal_rule', 'format_clear'],
  ];

  ngOnInit(): void {
    this.editor = new Editor();
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }
}
