import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AutofocusDirective } from '../directives/autofocus.directive';
import { HTMLContentInput } from '../models/contentInput.model';

/**
 * A presentational component for displaying and managing a form for texts post content.
 * @argument contentInput Input content item.
 * @argument isFocus Statu of focus.
 * @argument placeCursor Index of cursor.
 * @emits emptyInputEmmiter Event emitted when the backSpace key is pressed in start of textarea.
 * @emits enterInputEmitter Event emitted when the Enter key is pressed in a textarea.
 */
@Component({
  selector: 'app-text-input',
  standalone: true,
  imports: [AutofocusDirective],
  template: `
    <div
      [autofocus]="{ mustBeFocused: isFocus, placeCursor: placeCursor ? placeCursor : 0 }"
      class="contenteditable"
      contenteditable="true"
      (keydown.enter)="onEnter($event)"
      (keydown.backspace)="onbackspace($event)"
      (keydown.space)="onSpace($event)"
      [innerHTML]="contentInput.content.innerHTML"
      [class]="contentInput.type"></div>
  `,
  styles: `
    textarea, .contenteditable {
      padding: 10px;
      background-color: transparent;
      border: none;
      resize: none;
      height: auto;
      overflow: hidden;
      width: 100%;
      &:focus {
        outline: none;
      }
      &.p {
        font-size: 1rem;
      }
      &.h1 {
        font-size: 2rem;
      }
    }
      `,
})
export class TextInputComponent {
  @Input({ required: true }) contentInput: HTMLContentInput;

  @Input({ required: true }) isFocus: boolean;

  @Input({ required: true }) placeCursor: number | null;

  @Output() enterInputEmitter = new EventEmitter<{
    indexSelection: number;
    inputContentHTML: string;
  }>();

  @Output() emptyInputEmmiter = new EventEmitter<string>();

  //TODO: Toutes les modiffications faitent ne sont pas transmis aux outpu (sauf le cas d'un enter)
  // Il faut mettre en place une sinchronisation
  // a chaques changements de l'input ? (trop gourment en requête ?)
  // lorsque l'on quite le focus de l'input ?
  // Au bout d'un certain temps ?
  // ...

  preventDefaultEvent(event: Event) {
    event.preventDefault();
  }

  /**
   * Handles the enter key event.
   * Emit an event with the index of cursor and the content of divElement
   *
   * @param event The event object triggered by the enter key.
   */
  onEnter(event: Event) {
    this.preventDefaultEvent(event);

    const divInputElement = event.target as HTMLDivElement;
    const indexSelection = this.getIndexSelection(divInputElement);

    this.enterInputEmitter.emit({
      indexSelection: indexSelection,
      inputContentHTML: divInputElement.innerHTML,
    });
  }

  /**
   * Handles the backspace key, emit an event if the cursor is at the beginning of the content.
   *
   * @param event The event object triggered by the backspace key.
   */
  onbackspace(event: Event) {
    const divInputElement = event.target as HTMLDivElement;
    const indexSelection = this.getIndexSelection(divInputElement);

    if (indexSelection === 0) {
      this.emptyInputEmmiter.emit(divInputElement.innerHTML);
    }
  }

  /**
   * Prevents adding an additional space if there's already a space before or after the cursor position.
   *
   * @param event The event object triggered by the space key.
   */
  onSpace(event: Event) {
    const divInputElement = event.target as HTMLDivElement;
    const indexSelection = this.getIndexSelection(divInputElement);

    let previousChar = divInputElement.innerText
      .charAt(indexSelection - 1)
      .charCodeAt(0)
      .toString(16);

    let nextChar = divInputElement.innerText.charAt(indexSelection).charCodeAt(0).toString(16);

    // 20 -> espace
    // A0 -> espace inséquable
    if (previousChar === '20' || previousChar === 'a0' || nextChar === '20' || nextChar === 'a0') {
      event.preventDefault();
    }
  }

  /**
   * Gets the index of the current selection within the given HTMLDivElement element.
   *
   * @param element The HTMLDivElement element to get the index of the current selection from.
   * @returns The index of the current selection.
   */
  private getIndexSelection(element: HTMLDivElement): number {
    const selection = window.getSelection();
    const range = selection!.getRangeAt(0);

    const preCaretRange = range.cloneRange();

    preCaretRange.selectNodeContents(element);
    preCaretRange.setEnd(range.endContainer, range.endOffset);

    return preCaretRange.toString().length;
  }
}
