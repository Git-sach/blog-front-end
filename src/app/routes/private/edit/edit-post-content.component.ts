import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { PostsHttpService } from '../../../core/http/posts-http.service';
import { ContentInput, ContentInputCollection } from '../../../shared/models/contentInputCollection.model';
import { Post } from '../../../shared/models/post.model';
import { ImageInputComponent } from '../../../shared/ui/image-input.component';
import { PostContentFormComponent } from '../../../shared/ui/post-content-form.component';
import { TextInputComponent } from '../../../shared/ui/text-input.component';
import { EditFacade } from './edit.facade';

@Component({
  selector: 'app-edit-post-content',
  standalone: true,
  imports: [FormsModule, PostContentFormComponent, AsyncPipe, AsyncPipe, TextInputComponent, ImageInputComponent],
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
      <app-image-input [contentInput]="contentInput" [isFocus]="index === (autofocusIndex$ | async)"></app-image-input>
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
//TODO:
/**
 * -> Trouver un moyen de faire la logique du component sans subscribe ? avec des pipes ? transforme un post en un ContentInputCollection
 * -> Enlever le OnInit
 */
export class EditPostContentComponent implements OnInit {
  @Input({ required: true }) set id(id: string) {
    this.post = this.editFacade.getPost$(+id);
  }

  editFacade = inject(EditFacade);

  public post: Observable<Post | null>;

  // local stats
  inputsFormContent$ = new BehaviorSubject<ContentInputCollection>(new ContentInputCollection());
  autofocusIndex$ = new BehaviorSubject<number>(0);
  placeCursor$ = new BehaviorSubject<number>(0);

  html = '';

  ngOnInit(): void {
    // provisoire, passer par le input set id
    //TODO: Faire une methode pour passer du stringHTML au tableaux et faire la méthode inverse

    this.post.subscribe((post) => {
      if (post) {
        this.html = post.content;

        let match;
        const h1Regex = /<h1[^>]*>[\s\S]*?<\/h1>/gi;
        const pRegex = /<p[^>]*>[\s\S]*?<\/p>/gi;
        const srcImgRegex = /<img[^>]*\ssrc=['"]([^'"]+)['"]/gi;
        const baliseRegex = /<\/?[^>]+(>|$)/g;

        while ((match = h1Regex.exec(this.html)) !== null) {
          const currentInputs = this.inputsFormContent$.value;
          const newContentInput = new ContentInput('h1', match[0].replace(baliseRegex, ''), match.index);
          const updatedInputs = currentInputs.addContentInput(newContentInput);

          this.inputsFormContent$.next(updatedInputs);
        }

        while ((match = pRegex.exec(this.html)) !== null) {
          const currentInputs = this.inputsFormContent$.value;
          const newContentInput = new ContentInput('p', match[0].replace(baliseRegex, ''), match.index);
          const updatedInputs = currentInputs.addContentInput(newContentInput);
          this.inputsFormContent$.next(updatedInputs);
        }

        while ((match = srcImgRegex.exec(this.html)) !== null) {
          const currentInputs = this.inputsFormContent$.value;
          const newContentInput = new ContentInput('srcImg', match[1], match.index);
          const updatedInputs = currentInputs.addContentInput(newContentInput);
          this.inputsFormContent$.next(updatedInputs);
        }

        const sortedInputs = this.inputsFormContent$.value.sort();
        this.inputsFormContent$.next(sortedInputs);
      }
    });
  }

  /**
   * Method to split input content and create a new input after the current input with the content after the cursor.
   * and set the autofocus index to the new input
   * @Param index Index of the ContentInput
   * @param event Object containing information about the input event: indexSelection, and inputContent.
   */
  splitInputOnEnter(index: number, event: { indexSelection: number; inputContent: string }) {
    const textBeforeCursor: string = event.inputContent.substring(0, event.indexSelection);
    const textAfterCursor: string = event.inputContent.substring(event.indexSelection);

    const updatInput = new ContentInput('p', textBeforeCursor, 0);
    let updatedInputs = this.inputsFormContent$.value.updateAContentInput(index, updatInput);

    const newInput = new ContentInput('p', textAfterCursor, 0);
    updatedInputs = updatedInputs.addContentInput(newInput, index + 1);

    this.inputsFormContent$.next(updatedInputs);
    this.placeCursor$.next(0);
    this.autofocusIndex$.next(index + 1);

    // TODO: Gérer la sauvegarde dans le backend
  }

  /**
   * Method that deletes an input when the cursor is at the beginning of the input on backspace action
   * Text is merged into the previous input. It then sets the autofocus index to the new input.
   * @Param index Index of the ContentInput
   * @param event Object containing information about the input event: indexInput, indexSelection, and inputContent.
   */
  mergeInputOnBackspace(index: number, content: string) {
    //TODO: si l'element du haut est une image, on ne merge rien, on focus juste l'image
    const curentInputs = this.inputsFormContent$.value;
    if (['p', 'h1'].includes(curentInputs.contentInputCollection[index - 1].type)) {
      const cursorPosition = curentInputs.contentInputCollection[index - 1].content.length;

      const curentContent = curentInputs.contentInputCollection[index - 1].content;
      const updatInput = new ContentInput('p', curentContent + content, 0);

      const updatedInputs = curentInputs.updateAContentInput(index - 1, updatInput).deleteContentInput(index);

      this.inputsFormContent$.next(updatedInputs);
      this.placeCursor$.next(cursorPosition);
    }
    this.autofocusIndex$.next(index - 1);
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
