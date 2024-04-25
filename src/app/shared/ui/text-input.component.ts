import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AdjustTextareaHeightDirective } from '../directives/adjust-textarea-height.directive';
import { AutofocusDirective } from '../directives/autofocus.directive';
import { ContentInput } from '../models/contentInputCollection.model';

@Component({
  selector: 'app-text-input',
  standalone: true,
  imports: [AdjustTextareaHeightDirective, AutofocusDirective],
  template: `
    <textarea
      [rows]="1"
      type="text"
      [value]="contentInput.content"
      (keydown.Enter)="preventDefaultEvent($event)"
      adjustTextareaHeight
      [autofocus]="{ mustBeFocused: isFocus, placeCursor: placeCursor }"
      [class]="contentInput.type"
      (keydown.enter)="onEnter($event)"
      (keydown.backspace)="onbackspace($event)"></textarea>
  `,
  styles: `
    textarea {
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
    const textareaElement = event.target as HTMLTextAreaElement;
    this.enterInputEmitter.emit({
      indexSelection: textareaElement.selectionStart,
      inputContent: textareaElement.value,
    });
  }

  /**Emmet un event avec le contenu d'un input si il y a backspace au début de l'input */
  onbackspace(event: Event) {
    const textareaElement = event.target as HTMLTextAreaElement;
    if (textareaElement.selectionStart === 0) {
      this.emptyInputEmmiter.emit(textareaElement.value);
    }
  }
}
