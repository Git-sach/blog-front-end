import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { PostsHttpService } from '../../../core/http/posts-http.service';
import { ContentInput } from '../../../shared/models/contentInput.model';
import { ContentInputCollection } from '../../../shared/models/contentInputCollection.model';
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
      contentInput.id; let index = $index ){ @if(contentInput.type === "h1" || contentInput.type === "p") {
      <app-text-input
        [contentInput]="contentInput"
        [placeCursor]="placeCursor$ | async"
        [isFocus]="index === (autofocusIndex$ | async)"
        (emptyInputEmmiter)="mergeInputOnBackspace(index, $event)"
        (enterInputEmitter)="splitInputOnEnter(index, $event)"></app-text-input>
      }@else{
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

  // local stats
  inputsFormContent$ = new BehaviorSubject<ContentInputCollection>(new ContentInputCollection());
  autofocusIndex$ = new BehaviorSubject<number>(0);
  placeCursor$ = new BehaviorSubject<number>(0);

  /**
   * Method to split input content and create a new input after the current input with the content after the cursor.
   * and set the autofocus index to the new input
   * @Param index Index of the ContentInput
   * @param event Object containing information about the input event: indexSelection, and inputContent.
   */
  splitInputOnEnter(index: number, event: { indexSelection: number; inputContent: string }) {
    const splitedText = this.splitInputText(event.inputContent, event.indexSelection);

    const updatedInput = new ContentInput('p', splitedText[0], 0);
    let updatedInputs = this.inputsFormContent$.value.updateAContentInput(index, updatedInput);

    const newInput = new ContentInput('p', splitedText[1], 0);
    updatedInputs = updatedInputs.addContentInput(newInput, index + 1);

    this.inputsFormContent$.next(updatedInputs);
    this.placeCursor$.next(0);
    this.autofocusIndex$.next(index + 1);

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

    if (['p', 'h1'].includes(curentInputs.collectionValue[index - 1].type)) {
      const cursorPosition = curentInputs.collectionValue[index - 1].content.length;

      const curentContent = curentInputs.collectionValue[index - 1].content;
      const updatedInput = new ContentInput('p', curentContent + content, 0);

      const updatedInputs = curentInputs.updateAContentInput(index - 1, updatedInput).deleteContentInput(index);

      this.inputsFormContent$.next(updatedInputs);
      this.placeCursor$.next(cursorPosition);
    }
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
      const newContentInput = new ContentInput(type, match[1], match.index);
      const updatedInputs = currentInputs.addContentInput(newContentInput);
      outputContentInputCollection$.next(updatedInputs);
    }
  }

  //TODO: Methode a placer dans la class TextInput
  /**
   * Splits the input text at the specified index while handling non-breaking spaces (&nbsp;)
   * and preserving HTML tags' positions.
   *
   * The method performs the following steps:
   * 1. Saves the positions of non-breaking spaces at the start and end of the text.
   * 2. Adjusts the split index if there's a non-breaking space at the start and the index is not zero.
   * 3. Extracts HTML tags from the text and saves their positions.
   * 4. Replaces all non-breaking spaces with regular spaces in the text.
   * 5. If the text is a single space, it is converted to an empty string.
   * 6. Splits the text at the adjusted index.
   * 7. Replaces the last character of the first part with a non-breaking space if it is a regular space.
   * 8. Replaces the first character of the second part with a non-breaking space if it is a regular space.
   * 9. Restores the non-breaking space at the start or end of the text if they were originally present.
   * 10. TODO: Restores the HTML tags at their correct positions.
   *
   * @param text - The input text to be split.
   * @param index - The index at which to split the text.
   * @returns An array of two strings, representing the text before and after the split index.
   */
  splitInputText(text: string, index: number): string[] {
    const INSERTABLE_SPACE_CHAR = '&nbsp;';
    const SPACE_CHAR = ' ';

    let indexToSplit = index;
    let indexOffset = 0;

    const savedTags: { type: string; start: number; end: number }[] = [];
    const savedInsertableSpaces = {
      isSpaceStart: text.startsWith(INSERTABLE_SPACE_CHAR),
      isSpaceEnd: text.endsWith(INSERTABLE_SPACE_CHAR),
    };

    // Si on retire le premier espace, on en tient compte pour l'indexToSplit
    if (savedInsertableSpaces.isSpaceStart && indexToSplit !== 0) {
      indexOffset = -1;
    }

    // On retir les tag HTML et on remplace les espace inséquables
    text = this.extractHTMLTagFromText(text, savedTags);
    text = text.replace(new RegExp(INSERTABLE_SPACE_CHAR, 'g'), '');

    if (text === SPACE_CHAR) {
      text = '';
    }

    // On split le text à l'index
    let textBeforeIndex = text.substring(0, indexToSplit + indexOffset);
    let textAfterIndex = text.substring(indexToSplit + indexOffset);

    // On remplace le dernier caractère par INSERTABLE_SPACE_CHAR si c'est un SPACE_CHAR
    if (textBeforeIndex.endsWith(' ')) {
      textBeforeIndex = textBeforeIndex.slice(0, -1) + INSERTABLE_SPACE_CHAR;
    }

    // On Re-place l'INSERTABLE_SPACE_CHAR au bon endroit si il était présent en début de text
    if (savedInsertableSpaces.isSpaceStart) {
      indexToSplit === 0
        ? (textAfterIndex = INSERTABLE_SPACE_CHAR + textAfterIndex)
        : (textBeforeIndex = INSERTABLE_SPACE_CHAR + textBeforeIndex);
    }

    // On remplace le premier caractère par INSERTABLE_SPACE_CHAR si c'est un SPACE_CHAR
    if (textAfterIndex.startsWith(' ')) {
      textAfterIndex = INSERTABLE_SPACE_CHAR + textAfterIndex.slice(1);
    }

    // On Re-place l'INSERTABLE_SPACE_CHAR si il était présent en fin de text
    if (savedInsertableSpaces.isSpaceEnd) {
      textAfterIndex = textAfterIndex + INSERTABLE_SPACE_CHAR;
    }

    //TODO: Relpace les balises HTML aux bon endroits

    return [textBeforeIndex, textAfterIndex];
  }

  //TODO: Methode a placer dans la class TextInput
  /**
   * Extracts HTML tags from a string and saves their positions while removing them from the input string.
   *
   * @param inputText The input string containing HTML tags.
   * @param savedTags An array to save the positions of the extracted tags.
   * @returns The input string with HTML tags removed.
   */
  private extractHTMLTagFromText(inputText: string, savedTags: { type: string; start: number; end: number }[]): string {
    let inputContentString = inputText;

    while (inputContentString.includes(`<strong>`) === true || inputContentString.includes(`<u>`) === true) {
      let tagType = '';
      inputContentString.includes(`<strong>`) === true ? (tagType = 'strong') : (tagType = 'u');
      savedTags.push({
        type: tagType,
        start: inputContentString.indexOf(`<${tagType}>`),
        end: inputContentString.indexOf(`</${tagType}>`) - `<${tagType}>`.length, // - la longeure du <strong>
      });
      inputContentString = inputContentString.replace(`<${tagType}>`, '');
      inputContentString = inputContentString.replace(`</${tagType}>`, '');
    }
    return inputContentString;
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
