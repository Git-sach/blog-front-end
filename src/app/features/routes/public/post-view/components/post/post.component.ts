import { DatePipe } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import { HighlightModule } from 'ngx-highlightjs';
import { DynamicTableOfContentDirective } from '../../../../../../shared/directives/table-of-content.directive';
import { Post } from '../../../../../../shared/interfaces/post.interface';

import hljs from 'highlight.js/lib/core';
import typescript from 'highlight.js/lib/languages/typescript';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [DatePipe, DynamicTableOfContentDirective, HighlightModule],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostComponent implements AfterViewInit {
  @Input({ required: true }) post: Post;
  @ViewChild('child') child: ElementRef<HTMLDivElement>;

  public formated = '';

  // on peut suprimer la librairire angular de highlight ducoup
  ngAfterViewInit(): void {
    hljs.registerLanguage('typescript', typescript);

    const codeSection =
      this.child.nativeElement.getElementsByTagName('pre')[0].innerText;
    console.log(codeSection);

    this.formated = hljs.highlight(codeSection, {
      language: 'typescript',
    }).value;

    this.child.nativeElement.getElementsByTagName('pre')[0].innerHTML =
      this.formated;

    this.child.nativeElement
      .getElementsByTagName('pre')[0]
      .classList.add('hljs');
  }
}
