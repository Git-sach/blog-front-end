import { AsyncPipe } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { PostsHttpService } from '../../../core/http/posts-http.service';
import { ContentInput, ContentInputCollection } from '../../../shared/models/contentInputCollection.model';
import { Post } from '../../../shared/models/post.model';
import { PostContentFormComponent } from '../../../shared/ui/post-content-form.component';

@Component({
  selector: 'app-edit-post-content',
  standalone: true,
  imports: [FormsModule, PostContentFormComponent, AsyncPipe],
  template: `
    <div class="button solid" (click)="onClickProvisoirButton()">privisoire</div>
    <app-post-content-form
      (enterInputEmitter)="splitInputOnEnter($event)"
      (emptyInputEmmiter)="mergeInputOnBackspace($event)"
      [inputsFormContent]="inputsFormContent$ | async"
      [placeCursor]="placeCursor$ | async"
      [autofocusIndex]="autofocusIndex$ | async"></app-post-content-form>
  `,
  styles: ``,
})
//TODO:
/**
 * -> Faire la Facade de edit (pas de PostsHttpService)
 * -> Trouver un moyen de faire la logique du component sans subscribe ? avec des pipes ?
 * -> Enlever le OnInit
 * -> Faire le forEach ici pour afficher les inputs de type texts ou images ou code .. ?
 *    -> plusieur components UI pas sous forme de liste (textInput, imageInput, CodeInput...) ?
 * ->
 */
export class EditPostContentComponent implements OnInit {
  @Input({ required: true }) set id(id: string) {
    this.post = this.provisoireHttpPost.getPost(+id);
  }

  provisoireHttpPost = inject(PostsHttpService);

  public post: Observable<Post>;

  // local stats
  inputsFormContent$ = new BehaviorSubject<ContentInputCollection>(new ContentInputCollection());
  autofocusIndex$ = new BehaviorSubject<number>(0);
  placeCursor$ = new BehaviorSubject<number>(0);

  html = '';

  ngOnInit(): void {
    // provisoire, passer par le input set id
    //TODO: Faire une methode pour passer du stringHTML au tableaux et faire la méthode inverse

    this.post.subscribe((post) => {
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
    });
  }

  /**
   * Method to split input content and create a new input after the current input with the content after the cursor.
   * and set the autofocus index to the new input
   * @param event Object containing information about the input event: indexInput, indexSelection, and inputContent.
   */
  splitInputOnEnter(event: { indexInput: number; indexSelection: number; inputContent: string }) {
    const textBeforeCursor: string = event.inputContent.substring(0, event.indexSelection);
    const textAfterCursor: string = event.inputContent.substring(event.indexSelection);

    const updatInput = new ContentInput('p', textBeforeCursor, 0);
    let updatedInputs = this.inputsFormContent$.value.updateAContentInput(event.indexInput, updatInput);

    const newInput = new ContentInput('p', textAfterCursor, 0);
    updatedInputs = updatedInputs.addContentInput(newInput, event.indexInput + 1);

    this.inputsFormContent$.next(updatedInputs);
    this.placeCursor$.next(0);
    this.autofocusIndex$.next(event.indexInput + 1);

    // TODO: Gérer la sauvegarde dans le backend
  }

  /**
   * Method that deletes an input when the cursor is at the beginning of the input on backspace action
   * Text is merged into the previous input. It then sets the autofocus index to the new input.
   * @param event Object containing information about the input event: indexInput, indexSelection, and inputContent.
   */
  mergeInputOnBackspace(event: { indexInput: number; indexSelection: number; inputContent: string }) {
    const curentInputs = this.inputsFormContent$.value;
    const cursorPosition = curentInputs.contentInputCollection[event.indexInput - 1].content.length;

    const curentContent = curentInputs.contentInputCollection[event.indexInput - 1].content;
    const updatInput = new ContentInput('p', curentContent + event.inputContent, 0);

    const updatedInputs = curentInputs
      .updateAContentInput(event.indexInput - 1, updatInput)
      .deleteContentInput(event.indexInput);

    this.inputsFormContent$.next(updatedInputs);
    this.autofocusIndex$.next(event.indexInput - 1);
    this.placeCursor$.next(cursorPosition);
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
