import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AutofocusDirective } from '../directives/autofocus.directive';
import { ContentInput } from '../models/contentInputCollection.model';

@Component({
  selector: 'app-image-input',
  standalone: true,
  imports: [AutofocusDirective],
  template: ` <img
    [src]="contentInput.content"
    alt=""
    tabindex="0"
    [autofocus]="{ mustBeFocused: isFocus, placeCursor: null }" />`,
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
}
