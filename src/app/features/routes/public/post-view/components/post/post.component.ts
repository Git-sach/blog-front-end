import { DatePipe } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import { DynamicTableOfContentDirective } from '../../../../../../shared/directives/table-of-content.directive';
import { Post } from '../../../../../../shared/interfaces/post.interface';

import hljs from 'highlight.js/lib/core';
import typescript from 'highlight.js/lib/languages/typescript';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [DatePipe, DynamicTableOfContentDirective],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostComponent implements AfterViewInit {
  @Input({ required: true }) post: Post;
  @ViewChild('postContent') postContent: ElementRef<HTMLDivElement>;

  ngAfterViewInit(): void {
    this.highlightCodePostContent();
  }

  /**
   * Highlights code sections within the post content using the Highlight.js library.
   * each <pre> element containing <code> tags applies highlighting
   * @returns void
   */
  private highlightCodePostContent(): void {
    hljs.registerLanguage('typescript', typescript);

    let highlightedCode = '';
    const codesSection = this.postContent.nativeElement.querySelectorAll(
      'pre:has(code)'
    ) as NodeListOf<HTMLPreElement>;

    codesSection.forEach((codeSection) => {
      highlightedCode = hljs.highlight(codeSection.innerText, {
        language: 'typescript',
      }).value;

      codeSection.innerHTML = highlightedCode;
      codeSection.classList.add('hljs');
    });
  }
}
