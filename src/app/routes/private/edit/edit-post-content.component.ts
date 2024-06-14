import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { PostsHttpService } from '../../../core/http/posts-http.service';
import { ContentInput, HTMLContentInput, ImgContentInput } from '../../../shared/models/contentInput.model';
import { ContentInputCollection } from '../../../shared/models/contentInputCollection.model';
import { InputHTMLTextProcessor } from '../../../shared/models/InputHTMLTextProcessor.model';
import { Post } from '../../../shared/models/post.model';
import { ImageInputComponent } from '../../../shared/ui/image-input.component';
import { TextInputComponent } from '../../../shared/ui/text-input.component';
import { EditFacade } from './edit.facade';

@Component({
  selector: 'app-edit-post-content',
  standalone: true,
  imports: [FormsModule, AsyncPipe, AsyncPipe, TextInputComponent, ImageInputComponent],
  template: `
    <div class="container">
      @if(inputsFormContent$ | async; as contentInputCollection) { @for(contentInput of contentInputCollection.collectionValue; track
      contentInput.id; let index = $index ){ @if(isMachin(contentInput)) {
      <app-text-input
        [contentInput]="contentInput"
        [placeCursor]="placeCursor$ | async"
        [isFocus]="index === (autofocusIndex$ | async)"
        (emptyInputEmmiter)="mergeInputOnBackspace(index, $event)"
        (enterInputEmitter)="splitInputOnEnter(index, $event)"></app-text-input>
      }@else if(istruc(contentInput)){
      <app-image-input
        [contentInput]="contentInput"
        [isFocus]="index === (autofocusIndex$ | async)"
        (deleteInputEmitter)="deleteInput(index)"></app-image-input>
      } } }
    </div>

    <div class="button solid" (click)="onClickProvisoirButton()">privisoire</div>
  `,
  styles: `
    .container {
      display: flex;
      flex-direction: column;
      gap: 0px;
      width: 100%;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditPostContentComponent {
  @Input({ required: true }) set id(id: string) {
    this.editFacade.getPost$(+id).subscribe((post) => {
      if (post) {
        const htmlString = post.content;

        this.parseHTMLStringToContentInputObservable(this.inputsFormContent$, 'p', htmlString);
        this.parseHTMLStringToContentInputObservable(this.inputsFormContent$, 'h1', htmlString);
        this.parseHTMLStringToContentInputObservable(this.inputsFormContent$, 'srcImg', htmlString);

        const sortedInputs = this.inputsFormContent$.value.sort();
        this.inputsFormContent$.next(sortedInputs);
      }
    });
  }

  editFacade = inject(EditFacade);

  inputsFormContent$ = new BehaviorSubject<ContentInputCollection>(new ContentInputCollection());
  autofocusIndex$ = new BehaviorSubject<number>(0);
  placeCursor$ = new BehaviorSubject<number>(0);

  splitInputOnEnter(index: number, event: { indexSelection: number; inputContentHTML: string }) {
    const eventInputHTMLText: InputHTMLTextProcessor = new InputHTMLTextProcessor(event.inputContentHTML);
    const splitedHTMLText = eventInputHTMLText.splitInputHTMLTextAtIndex(event.indexSelection);

    const updatedInput = new ContentInput('p', splitedHTMLText[0], 0);
    this.updateContentInputAtIndex(index, updatedInput);

    const newInput = new ContentInput('p', splitedHTMLText[1], 0);
    this.addContentInputAtIndex(index + 1, newInput);

    this.placeFocusInputAtIndex(index + 1);
    this.placeCursorAtIndex(0);

    // TODO: Gérer la sauvegarde dans le backend
  }

  /**
   * Method that deletes an input when the cursor is at the beginning of the input text on backspace action
   * Text is merged into the previous input. It then sets the autofocus index to the previous input.
   * @Param index Index of the ContentInput
   * @param event Object containing information about the input event: indexInput, indexSelection, and inputContent.
   */
  mergeInputOnBackspace(index: number, content: string) {
    const curentInputs = this.inputsFormContent$.value;

    // if (['p', 'h1'].includes(curentInputs.collectionValue[index - 1].type)) {
    //   const cursorPosition = curentInputs.collectionValue[index - 1].content.innerText.length;

    //   const curentContent = curentInputs.collectionValue[index - 1].content;
    //   const updatedInput = new ContentInput('p', new InputHTMLTextProcessor(curentContent + content), 0);

    //   const updatedInputs = curentInputs.updateAContentInput(index - 1, updatedInput).deleteContentInput(index);

    //   this.inputsFormContent$.next(updatedInputs);
    //   this.placeCursor$.next(cursorPosition);
    // }
    this.autofocusIndex$.next(index - 1);
  }

  /**
   * Method that deletes an inputContent on backspace action (use for input images)
   * It then sets the autofocus index to the previous input.
   * @Param index Index of the ContentInput
   */
  deleteInput(index: number) {
    const curentInputs = this.inputsFormContent$.value;
    const updatedInputs = curentInputs.deleteContentInput(index);
    this.inputsFormContent$.next(updatedInputs);
    this.autofocusIndex$.next(index - 1);
  }

  parseHTMLStringToContentInputObservable(
    outputContentInputCollection$: BehaviorSubject<ContentInputCollection>,
    type: 'p' | 'h1' | 'srcImg',
    HTMLString: string,
  ) {
    const h1Regex = /<\s*h1[^>]*>(.*?)<\s*\/\s*h1\s*>/gi;
    const pRegex = /<\s*p[^>]*>(.*?)<\s*\/\s*p\s*>/gi;
    const srcImgRegex = /<img[^>]*\ssrc=['"]([^'"]+)['"]/gi;

    let regexToExec: RegExp = / /;
    let match;

    if (type === 'p') {
      regexToExec = pRegex;
    } else if (type === 'h1') {
      regexToExec = h1Regex;
    } else if (type === 'srcImg') {
      regexToExec = srcImgRegex;
    }

    while ((match = regexToExec.exec(HTMLString)) !== null) {
      const currentInputs = outputContentInputCollection$.value;
      let content: string | InputHTMLTextProcessor = '';
      if (type === 'p' || type === 'h1') {
        content = new InputHTMLTextProcessor(match[1]);
      } else if (type === 'srcImg') {
        content = match[1];
      }
      const newContentInput = new ContentInput(type, content, match.index);
      const updatedInputs = currentInputs.addContentInput(newContentInput);
      outputContentInputCollection$.next(updatedInputs);
    }
  }

  private placeCursorAtIndex(index: number): void {
    this.placeCursor$.next(0);
  }

  private placeFocusInputAtIndex(index: number): void {
    this.autofocusIndex$.next(index);
  }

  private updateContentInputAtIndex(indexOfInputToUpdate: number, newInput: ContentInput<InputHTMLTextProcessor | string>): void {
    const updatedInputs = this.inputsFormContent$.value.updateAContentInput(indexOfInputToUpdate, newInput);
    this.inputsFormContent$.next(updatedInputs);
  }

  private addContentInputAtIndex(indexOfInputToAdd: number, newInput: ContentInput<InputHTMLTextProcessor | string>): void {
    const updatedInputs = this.inputsFormContent$.value.addContentInput(newInput, indexOfInputToAdd);
    this.inputsFormContent$.next(updatedInputs);
  }

  istruc(obj: any): obj is ImgContentInput {
    return obj.type === 'srcImg';
  }

  isMachin(obj: any): obj is HTMLContentInput {
    return obj.type === 'h1' || obj.type === 'p';
  }

  //PROVISOIR

  httpEdit = inject(PostsHttpService);

  onClickProvisoirButton() {
    const token =
      'eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzZWxmIiwic3ViIjoiZGJhZG1pbiIsImV4cCI6MTcxMzM1NTIwNSwiaWF0IjoxNzEzMjY4ODA1fQ.OfVVdNmbGa42f32_eKbB0Xy9qcnRRQBjYw7RkPWxYC';

    this.httpEdit.creatPost(new Post(), token).subscribe({
      next(post) {
        console.log(post);
      },
      complete() {
        console.log('this.complete');
      },
    });
  }
}
