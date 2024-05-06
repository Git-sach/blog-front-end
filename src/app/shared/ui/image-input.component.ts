import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { AutofocusDirective } from '../directives/autofocus.directive';
import { ContentInput } from '../models/contentInputCollection.model';

/**
 * A presentational component for displaying and managing a form for image post content.
 * @argument contentInput Input content item.
 * @argument isFocus Statu of focus.
 * @emits deleteInputEmitter Event emitted when the backSpace key is pressed.
 */
@Component({
  selector: 'app-image-input',
  standalone: true,
  imports: [AutofocusDirective],
  template: ` <img
    [src]="contentInput.content"
    alt=""
    tabindex="0"
    [autofocus]="{ mustBeFocused: isFocus, placeCursor: null }"
    (keydown.backspace)="onbackspace()" />`,
  styles: `
  img {
    width: 70%;
    margin: 30px 0;
    cursor: pointer;
      outline: solid 2px transparent;
    &:focus{
      outline: solid 2px var(--hovered_solid_backgrounds);
      border-radius: 5px;       
    }
    &:hover{
      outline: solid 2px var(--hovered_solid_backgrounds);
      border-radius: 5px;
    }
  }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageInputComponent {
  @Input({ required: true }) contentInput: ContentInput;

  @Input({ required: true }) isFocus: boolean;

  @Output() deleteInputEmitter = new EventEmitter();

  onbackspace() {
    this.deleteInputEmitter.emit();
  }
}
