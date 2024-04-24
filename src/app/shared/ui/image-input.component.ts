import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ContentInput } from '../models/contentInputCollection.model';

@Component({
  selector: 'app-image-input',
  standalone: true,
  imports: [],
  template: ` <img [src]="contentInput.content" alt="" />`,
  styles: `
  img {
    width: 70%;
    margin: 30px 0;
    cursor: pointer;
      border: solid 2px transparent;
    &:hover{
      border: solid 2px var(--hovered_solid_backgrounds);
      border-radius: 5px;
    }
  }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageInputComponent {
  @Input({ required: true }) contentInput: ContentInput;
}
