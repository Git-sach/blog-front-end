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
//import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';
/**TODO:
 * Problèmatique: on a parfois du HTML dans le Typescript
 * On peut ou toujour disccier les 2 ou faire un code pour interpréter les 2 en même temps
 * Extraire les parties HTML pour les highlight en HTML
 * Extraire les parties Typescript pour les highlight en typescript
 * Mettre le style des html
 *  */

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
    hljs.registerLanguage('xml', xml);

    let highlightedCode = '';
    const codesSection = this.postContent.nativeElement.querySelectorAll(
      'pre:has(code)'
    ) as NodeListOf<HTMLPreElement>;

    codesSection.forEach((codeSection) => {
      highlightedCode = hljs.highlight(codeSection.innerText, {
        language: 'xml',
      }).value;

      codeSection.innerHTML = highlightedCode;
      codeSection.classList.add('hljs');
    });
  }
}
