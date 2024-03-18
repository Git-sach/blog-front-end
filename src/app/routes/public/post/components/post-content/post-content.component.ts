import { DatePipe } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';

import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';
import { DynamicTableOfContentDirective } from '../../../../../shared/directives/table-of-content.directive';
import { Post } from '../../../../../shared/interfaces/post.interface';

@Component({
  selector: 'app-post-content',
  standalone: true,
  imports: [DatePipe, DynamicTableOfContentDirective],
  templateUrl: './post-content.component.html',
  styleUrl: './post-content.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostContentComponent implements AfterViewInit {
  post = input.required<Post>();

  ngAfterViewInit(): void {
    hljs.registerLanguage('xml', xml);
    hljs.registerLanguage('typescript', typescript);
    hljs.registerLanguage('javascript', javascript);
    hljs.highlightAll();
  }
}
