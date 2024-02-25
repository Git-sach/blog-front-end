import { AfterViewInit, Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[dynamicTableOfContent]',
  standalone: true,
})
export class DynamicTableOfContentDirective implements AfterViewInit {
  constructor(private contentPost: ElementRef<HTMLDivElement>) {}

  ngAfterViewInit(): void {
    const paragraphTitles =
      this.contentPost.nativeElement.querySelectorAll('h1');
    const paragraphs = this.contentPost!.nativeElement.querySelectorAll('p');

    paragraphs.forEach((element) => {
      if (element.textContent?.includes('--TOC--')) {
        const tableOfContentContainerDiv = this.creatHtmlElement(
          'div',
          'table_of_content'
        );

        const headerOfTableOfContent = this.creatHtmlElement(
          'h1',
          'title',
          'Dans cet article'
        );

        tableOfContentContainerDiv.appendChild(headerOfTableOfContent);

        // On remplace le tag --TOC-- par l'element tableOfContent
        this.contentPost.nativeElement.replaceChild(
          tableOfContentContainerDiv,
          element
        );

        paragraphTitles.forEach((element) => {
          if (!element.classList.contains('title')) {
            const elementOfTableOfContent = this.creatHtmlElement(
              'a',
              '',
              element.innerHTML
            );

            // Ajout d'un Event au click sur les elementOfTableOfContent pour Scroll au title correspondant
            elementOfTableOfContent.addEventListener('click', () => {
              element.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
                inline: 'nearest',
              });
            });
            tableOfContentContainerDiv.appendChild(elementOfTableOfContent);
          }
        });
      }
    });
  }

  creatHtmlElement(
    elementType: 'h1' | 'div' | 'a',
    className: string,
    innerHTML?: string
  ) {
    const element = document.createElement(elementType);
    className ? element.classList.add(className) : null;
    innerHTML ? (element.innerHTML = innerHTML) : null;
    return element;
  }
}
