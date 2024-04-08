import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { AdjustTextareaHeightDirective } from '../directives/adjust-textarea-height.directive';
import { AutofocusDirective } from '../directives/autofocus.directive';

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
      @for(input of inputsFormContent; track input.content; let index = $index) {
      <textarea
        [rows]="1"
        (keydown.enter)="onEnter(index, $event)"
        type="text"
        [value]="input.content"
        [autofocus]="index === autofocusIndex"
        (keydown.Tab)="preventDefaultEvent($event)"
        (keydown.shift.tab)="preventDefaultEvent($event)"
        adjustTextareaHeight>
      </textarea>
      }
    </div>
  `,
  styles: `
    .container {
      display: flex;
      flex-direction: column;
      gap: 10px;
      textarea {
        padding: 1vw;
        background-color: transparent;
        // border: transparent;
        resize: none;
        height: auto;
        overflow: hidden;
        // &:focus {
        //   outline: none;
        // } 
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostContentFormComponent {
  @Input({ required: true }) inputsFormContent: {
    type: string;
    content: string;
    start: number;
  }[];

  @Input({ required: true }) autofocusIndex: number | null;

  @Output() enterInputEmitter = new EventEmitter<{
    indexInput: number;
    indexSelection: number;
    inputContent: string;
  }>();

  onEnter(index: number, event: Event) {
    const textareaElement = event.target as HTMLTextAreaElement;

    event.preventDefault();
    this.enterInputEmitter.emit({
      indexInput: index,
      indexSelection: textareaElement.selectionStart,
      inputContent: textareaElement.value,
    });
  }

  preventDefaultEvent(event: Event) {
    event.preventDefault();
  }
}
