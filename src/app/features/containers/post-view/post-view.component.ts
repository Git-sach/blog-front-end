import { DatePipe } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Editor, NgxEditorModule, Toolbar } from 'ngx-editor';
import { LayoutComponent } from '../../../core/containers/layout/layout.component';
import { posts } from '../../../core/mocks/posts.mock';
import { Post } from '../../../shared/interfaces/post.interface';

@Component({
  selector: 'app-post-view',
  standalone: true,
  imports: [DatePipe, LayoutComponent, NgxEditorModule, FormsModule],
  templateUrl: './post-view.component.html',
  styleUrl: './post-view.component.scss',
})
export class PostViewComponent implements OnInit, AfterViewInit {
  @ViewChild('contentPost') contentPost?: ElementRef<HTMLDivElement>;
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

  ngAfterViewInit(): void {
    const h1s = this.contentPost?.nativeElement.querySelectorAll('H1');
    const ps = this.contentPost?.nativeElement.querySelectorAll('p');
    if (ps) {
      ps.forEach((element) => {
        if (element.textContent?.includes('--TOC--')) {
          const tocElement: HTMLParagraphElement = element;
          const newDivElement: HTMLDivElement = document.createElement('div');

          const titleTableOfContent: HTMLHeadElement =
            document.createElement('h1');
          titleTableOfContent.innerHTML = 'Dans cet article';
          titleTableOfContent.classList.add('title');
          newDivElement.appendChild(titleTableOfContent);

          newDivElement.classList.add('table_of_content');
          this.contentPost?.nativeElement.replaceChild(
            newDivElement,
            tocElement
          );

          h1s!.forEach((element, index) => {
            if (!element.classList.contains('title')) {
              const newElement = document.createElement('a');
              newElement.innerHTML = element.innerHTML;
              newElement.addEventListener('click', () => {
                element.scrollIntoView({
                  behavior: 'smooth',
                  block: 'start',
                  inline: 'nearest',
                });
              });
              newDivElement.appendChild(newElement);
            }
          });
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  /**
   * Faire un pipe
   * Pour la table of contents: prendre tous les H1 et les mettre dans la table puis ajouter les href
   * Mettre dans une div ?
   * Pour savoir ou le placer ajouter un flag <<TOC>> dans le HTML??*/
}
