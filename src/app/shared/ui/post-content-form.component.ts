import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { AutofocusDirective } from '../directives/autofocus.directive';

@Component({
  selector: 'app-post-content-form',
  standalone: true,
  imports: [AutofocusDirective],
  template: `
    <div class="container">
      @for(input of inputsFormContent; track input.start; let index = $index) {
      <textarea
        rows="1"
        (keydown.enter)="onEnter(index, $event)"
        type="text"
        [value]="input.content"
        [autofocus]="index === 3"
      >
      </textarea>
      }
    </div>
  `,
  styles: `
    .container {
      display: flex;
      flex-direction: column;
      gap: 20px;
      textarea {
        padding: 1vw;
        background-color: transparent;
        border: transparent;
        resize: none;
        height: auto; 
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostContentFormComponent {
  //transformer en signal Input ??
  @Input({ required: true }) inputsFormContent: {
    type: string;
    content: string;
    start: number;
  }[];

  @Output() addInputEmitter = new EventEmitter<number>();

  onEnter(index: number, event: Event) {
    event.preventDefault();
    this.addInputEmitter.emit(index);

    // pas faire ca ici mais remonter un event ?
  }
}
