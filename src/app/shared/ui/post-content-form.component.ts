import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { AdjustTextareaHeightDirective } from '../directives/adjust-textarea-height.directive';
import { AutofocusDirective } from '../directives/autofocus.directive';
import { ContentInputCollection } from '../models/contentInputCollection.model';

/**
 * A presentational component for displaying and managing a form for post content.
 * @argument inputsFormContent List of input content items.
 * @argument autofocusIndex Index of the input to be autofocused.
 * @emits enterInputEmitter Event emitted when the Enter key is pressed in a textarea.
 */
@Component({
  selector: 'app-post-content-form',
  standalone: true,
  imports: [AutofocusDirective, AdjustTextareaHeightDirective],
  template: `
    <div class="container">
      @if(inputsFormContent) { @for(input of inputsFormContent.contentInputCollection; track input.content; let index =
      $index) {
      <textarea
        [rows]="1"
        (keydown.enter)="onEnter(index, $event)"
        (keydown.backspace)="onbackspace(index, $event)"
        type="text"
        [value]="input.content"
        [autofocus]="{ mustBeFocused: index === autofocusIndex, placeCursor: placeCursor }"
        (keydown.Tab)="preventDefaultEvent($event)"
        (keydown.shift.tab)="preventDefaultEvent($event)"
        adjustTextareaHeight
        [class]="input.type">
      </textarea>
      } }
    </div>
  `,
  styles: `
    .container {
      display: flex;
      flex-direction: column;
      gap: 0px;
      textarea {
        padding: 10px;
        background-color: transparent;
        border: none;
        resize: none;
        height: auto;
        overflow: hidden;
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
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostContentFormComponent {
  @Input({ required: true }) inputsFormContent: ContentInputCollection | null;

  @Input({ required: true }) autofocusIndex: number | null;

  @Input({ required: true }) placeCursor: number | null;

  @Output() enterInputEmitter = new EventEmitter<{
    indexInput: number;
    indexSelection: number;
    inputContent: string;
  }>();

  @Output() emptyInputEmmiter = new EventEmitter<{
    indexInput: number;
    indexSelection: number;
    inputContent: string;
  }>();

  onEnter(index: number, event: Event) {
    event.preventDefault();

    const textareaElement = event.target as HTMLTextAreaElement;

    this.enterInputEmitter.emit({
      indexInput: index,
      indexSelection: textareaElement.selectionStart,
      inputContent: textareaElement.value,
    });
  }

  preventDefaultEvent(event: Event) {
    event.preventDefault();
  }

  onbackspace(index: number, event: Event) {
    const textareaElement = event.target as HTMLTextAreaElement;

    if (textareaElement.selectionStart === 0 && index !== 0) {
      this.emptyInputEmmiter.emit({
        indexInput: index,
        indexSelection: 0,
        inputContent: textareaElement.value,
      });
    }
  }
}
