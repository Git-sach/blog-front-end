import { Directive, ElementRef, inject, Input } from '@angular/core';

@Directive({
  selector: '[autofocus]',
  standalone: true,
})
export class AutofocusDirective {
  @Input('autofocus') focus: { mustBeFocused: boolean; placeCursor: number };
  host = inject(ElementRef);

  ngOnChanges() {
    if (this.focus.mustBeFocused) {
      setTimeout(() => {
        this.placeCursorAtIndex(this.host, this.focus.placeCursor);
      }, 0);
    }
  }

  /**
   * Place the cursor at a specific index within an editable element.
   *
   * @param element The reference to the editable element.
   * @param cursorIndex The index where the cursor should be placed.
   */
  private placeCursorAtIndex(element: ElementRef, cursorIndex: number): void {
    let range = document.createRange();
    let childNode = element.nativeElement.childNodes[0];

    // Dans le cas où le childNode n'existe pas (text vide) on le crée pour pouvoir focus
    if (!childNode) {
      element.nativeElement.appendChild(document.createTextNode(''));
      childNode = element.nativeElement.childNodes[0];
    }
    range.setStart(childNode, cursorIndex);
    range.collapse(true);

    let selecttion = window.getSelection();
    selecttion?.removeAllRanges();
    selecttion?.addRange(range);
  }
}
