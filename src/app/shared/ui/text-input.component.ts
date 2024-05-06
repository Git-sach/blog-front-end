import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AdjustTextareaHeightDirective } from '../directives/adjust-textarea-height.directive';
import { AutofocusDirective } from '../directives/autofocus.directive';
import { ContentInput } from '../models/contentInputCollection.model';

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
  imports: [AdjustTextareaHeightDirective, AutofocusDirective],
  template: `
    <!-- <textarea
      [rows]="1"
      type="text"
      [value]="contentInput.content"
      adjustTextareaHeight
      [autofocus]="{ mustBeFocused: isFocus, placeCursor: placeCursor }"
      [class]="contentInput.type"
      (keydown.enter)="onEnter($event)"
      (keydown.backspace)="onbackspace($event)"></textarea> -->
    <div
      [autofocus]="{ mustBeFocused: isFocus, placeCursor: placeCursor }"
      class="contenteditable"
      contenteditable="true"
      (keydown.enter)="onEnter($event)"
      [innerHTML]="contentInput.content"
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
  @Input({ required: true }) contentInput: ContentInput;

  @Input({ required: true }) isFocus: boolean;

  @Input({ required: true }) placeCursor: number | null;

  @Output() enterInputEmitter = new EventEmitter<{
    indexSelection: number;
    inputContent: string;
  }>();

  @Output() emptyInputEmmiter = new EventEmitter<string>();

  preventDefaultEvent(event: Event) {
    event.preventDefault();
  }

  onEnter(event: Event) {
    this.preventDefaultEvent(event);
    const textareaElement = event.target as HTMLDivElement;

    const selection = window.getSelection();

    const range = selection!.getRangeAt(0);
    const endOffset = selection!.getRangeAt(0).endOffset;
    console.log(endOffset);
    const preCaretRange = range.cloneRange();
    preCaretRange.selectNodeContents(textareaElement);
    preCaretRange.setEnd(range.endContainer, range.endOffset);
    console.log(preCaretRange.toString().length);

    // console.log(preCaretRange.toString().length);
    // console.log(preCaretRange.toString());
    // console.log(textareaElement.innerText);

    this.enterInputEmitter.emit({
      indexSelection: preCaretRange.toString().length,
      inputContent: textareaElement.innerHTML,
    });
    // this.enterInputEmitter.emit({
    //   indexSelection: textareaElement.selectionStart,
    //   inputContent: textareaElement.value,
    // });
  }

  /**Emmet un event avec le contenu d'un input si il y a backspace au début de l'input */
  onbackspace(event: Event) {
    const textareaElement = event.target as HTMLTextAreaElement;
    if (textareaElement.selectionStart === 0) {
      this.emptyInputEmmiter.emit(textareaElement.value);
    }
  }
}
