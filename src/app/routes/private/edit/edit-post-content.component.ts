import { AsyncPipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { PostContentFormComponent } from '../../../shared/ui/post-content-form.component';

@Component({
  selector: 'app-edit-post-content',
  standalone: true,
  imports: [FormsModule, PostContentFormComponent, AsyncPipe],
  template: `
    <!-- <ngx-editor-menu [editor]="editor" [toolbar]="toolbar"> </ngx-editor-menu>
  <ngx-editor [editor]="editor" [(ngModel)]="html"></ngx-editor>
  {{ html }} -->
    <!-- <div [innerHTML]="html"></div> -->
    <app-post-content-form
      (enterInputEmitter)="addInput($event)"
      [inputsFormContent]="inputsFormContent"
      [autofocusIndex]="autofocusIndex | async"></app-post-content-form>
  `,
  styles: ``,
})
export class EditPostContentComponent implements OnInit {
  @Input() set id(id: number) {}

  // local stats
  inputsFormContent: { type: string; content: string; start: number }[] = [];
  autofocusIndex = new BehaviorSubject<number>(0);

  html = `<h1>Hello world!dsds</h1><p>--TOC--</p><h1>Hello world!dsds</h1><h1>Hello world!dsds</h1><h1>Je suis une autre titre</h1><code>dsds</code><p style="text-align:center"><img src="https://imgs.search.brave.com/xZTkrGArJ_Tw3ld7KE0NfkhHppQa814cO-Ffj35TwlI/rs:fit:500:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/ZnJlZS1waG90by9t/b3VudGFpbi12aWV3/LWFpLWdlbmVyYXRl/ZC1pbWFnZV8yNjg4/MzUtNjk3MS5qcGc_/c2l6ZT02MjYmZXh0/PWpwZw" alt="" title=""><p>Je suis une text</p><h1>Je suis encore un autre titre</h1><p>e Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression. Le Lorem Ipsum est le faux texte standard de l\'imprimerie depuis les années 1500, quand un imprimeur anonyme assembla ensemble des morceaux de texte pour réaliser un livre spécimen de polices de texte. Il n\'a pas fait que survivre cinq siècles,</p>`;

  ngOnInit(): void {
    // provisoire, passer par un signal ou observable
    //TODO: Faire une methode pour passer du stringHTML au tableaux et faire la méthode inverse
    let match;
    const h1Regex = /<h1[^>]*>[\s\S]*?<\/h1>/gi;
    const pRegex = /<p[^>]*>[\s\S]*?<\/p>/gi;
    const baliseRegex = /<\/?[^>]+(>|$)/g;

    while ((match = h1Regex.exec(this.html)) !== null) {
      this.inputsFormContent.push({
        type: 'h1',
        content: match[0].replace(baliseRegex, ''),
        start: match.index,
      });
    }

    while ((match = pRegex.exec(this.html)) !== null) {
      this.inputsFormContent.push({
        type: 'p',
        content: match[0].replace(baliseRegex, ''),
        start: match.index,
      });
    }

    this.inputsFormContent.sort((a, b) => a.start - b.start);
  }

  /**
   * Method that creates a new input after the current input with the content after the cursor
   * and set the autofocus index to the new input
   * @param event
   */
  addInput(event: { indexInput: number; indexSelection: number; inputContent: string }) {
    this.autofocusIndex.next(event.indexInput + 1);
    const textBeforeCursor: string = event.inputContent.substring(0, event.indexSelection);
    const textAfterCursor: string = event.inputContent.substring(event.indexSelection);

    this.inputsFormContent[event.indexInput].content = textBeforeCursor;

    const newInput = [...this.inputsFormContent];

    newInput.splice(event.indexInput + 1, 0, {
      type: 'p',
      content: textAfterCursor,
      start: 0,
    });

    this.inputsFormContent = newInput;

    // TODO: gérer le cas invers (ou on reprend l'input d'en dessous pour l'injecter au dessus)
    // TODO: Bien gérer le cas ou ou on suprime un input vide (l'enlever et focus au dessus)
    // TODO: Gérer la sauvegarde dans le backend
  }
}
