import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { PostsHttpService } from '../../../core/http/posts-http.service';
import { ContentInput, ContentInputCollection } from '../../../shared/models/contentInputCollection.model';
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
      @if(inputsFormContent$ | async; as contentInputCollection) { @for(contentInput of
      contentInputCollection.contentInputCollection; track contentInput.content; let index = $index ){
      @if(contentInput.type === "h1" || contentInput.type === "p") {
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
    //TODO: refacto
    // Faire la methode splitText avec en argument le text et l'index et faire la methode concat text

    let indexToSplit = event.indexSelection;
    const savedTags: { type: string; start: number; end: number }[] = [];
    const savedInsertableSpaces = {
      isSpaceStart: event.inputContent.startsWith('&nbsp;'),
      isSpaceEnd: event.inputContent.endsWith('&nbsp;'),
    };

    // si on supprimer un espace en début de chaine il faut en tenir compte pour split au bon endroit
    // Pas faire comme cela. Faire plutot un offset que l'on ajout dans les methodes textBeforeCursor et textAfterCursor
    console.log(savedInsertableSpaces);

    if (savedInsertableSpaces.isSpaceStart && indexToSplit !== 0) {
      indexToSplit--;
    }
    console.log(indexToSplit);

    const textContentWithoutTags = this.extractHTMLTagFromString(event.inputContent, savedTags);
    console.log(textContentWithoutTags);

    const textContentWithoutInsertableSpaces = textContentWithoutTags.replace(/&nbsp;/g, '');
    console.log(textContentWithoutInsertableSpaces);

    /**
     * ALGO
     * -> Save les &nbsp; en début et fin de chaine
     * -> Enlever les &nbsp
     * -> Split
     * -> Regarder si le befor a un ' ' a la fin et le remplacer par &nbsp
     * -> Regarder si le after a un ' ' en début et le remplacer par &nbsp
     * -> Re placer les &nbsp de début et de fin
     *
     * ALGO INVERS
     * -> Save les &nbsp; en début et fin de chaine
     * -> Enlever les &nbsp
     * -> Merge
     * ->
     */

    /**
     * Condition initiale: On ne peut pas avoir de &nbsp; autre part que au début ou a la fin d'une chaine (gérer le cas du coller)
     * Les espaces normeaux ne sont pas interpréter si ils sont en début de chaine, en fin de chaine ou apres un espace (dérinier cas ne doit pas arriver)
     *
     * il faudra faire la même logique dans l'autre sans
     *
     * On peut avoir ces cas:
     * -> ' 'ma chaine'&nbsp;' (after)    -> Dans ce cas : remplacer le 1er espace par &nbsp a la fin du split;
     * -> ma chaine' ' (before)           -> Dans ce cas : remplacer le dernier espace par un &nbsp
     *
     * récupéere les emplacements des &nbsp;
     * Les enlever pour faire le split
     * les replacer
     * Normalement il ne peut que en avoire au debut et ou a la fin de la chaine (le cas de la fin est a gérer ?)
     * Il faut aussi placer un &nbsp; en début de chaine a la place d'un ' ' si il y en a un car c'est non visible a l'affichage
     */

    let textBeforeCursor: string = textContentWithoutInsertableSpaces.substring(0, indexToSplit);
    let textAfterCursor: string = textContentWithoutInsertableSpaces.substring(indexToSplit);

    console.log('before:|', textBeforeCursor, '|');
    console.log('after:|', textAfterCursor, '|');

    if (textBeforeCursor.endsWith(' ')) {
      //on remplace le dernier caractère
      console.log(textBeforeCursor);
      textBeforeCursor = textBeforeCursor.slice(0, -1) + '&nbsp;';
      console.log(textBeforeCursor);
    }
    if (savedInsertableSpaces.isSpaceStart) {
      if (indexToSplit === 0 && event.indexSelection === 0) {
        textAfterCursor = '&nbsp;' + textAfterCursor;
      } else {
        textBeforeCursor = '&nbsp;' + textBeforeCursor;
      }
    }

    if (textAfterCursor.startsWith(' ')) {
      //on remplace le premier caractère
      console.log(textAfterCursor);
      textAfterCursor = '&nbsp;' + textAfterCursor.slice(1);
      console.log(textAfterCursor);
    }
    if (savedInsertableSpaces.isSpaceEnd) {
      textAfterCursor = textAfterCursor + '&nbsp;';
    }

    //TODO: Relpace les balises au bon endroits

    const updatedInput = new ContentInput('p', textBeforeCursor, 0);
    let updatedInputs = this.inputsFormContent$.value.updateAContentInput(index, updatedInput);

    const newInput = new ContentInput('p', textAfterCursor, 0);
    updatedInputs = updatedInputs.addContentInput(newInput, index + 1);

    this.inputsFormContent$.next(updatedInputs);
    this.placeCursor$.next(0);
    this.autofocusIndex$.next(index + 1);

    // TODO: Gérer la sauvegarde dans le backend
  }

  /**
   * Extracts HTML tags from a string and saves their positions while removing them from the input string.
   *
   * @param inputText The input string containing HTML tags.
   * @param savedTags An array to save the positions of the extracted tags.
   * @returns The input string with HTML tags removed.
   */
  private extractHTMLTagFromString(
    inputText: string,
    savedTags: { type: string; start: number; end: number }[],
  ): string {
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

  /**
   * Method that deletes an input when the cursor is at the beginning of the input text on backspace action
   * Text is merged into the previous input. It then sets the autofocus index to the previous input.
   * @Param index Index of the ContentInput
   * @param event Object containing information about the input event: indexInput, indexSelection, and inputContent.
   */
  mergeInputOnBackspace(index: number, content: string) {
    const curentInputs = this.inputsFormContent$.value;

    if (['p', 'h1'].includes(curentInputs.contentInputCollection[index - 1].type)) {
      const cursorPosition = curentInputs.contentInputCollection[index - 1].content.length;

      const curentContent = curentInputs.contentInputCollection[index - 1].content;
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
