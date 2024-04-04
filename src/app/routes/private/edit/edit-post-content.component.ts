import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-post-content',
  standalone: true,
  imports: [FormsModule],
  template: `
    <!-- <ngx-editor-menu [editor]="editor" [toolbar]="toolbar"> </ngx-editor-menu>
  <ngx-editor [editor]="editor" [(ngModel)]="html"></ngx-editor>
  {{ html }} -->
    <div [innerHTML]="html"></div>
    <p>edit-post-content works!</p>
  `,
  styles: ``,
})
export class EditPostContentComponent implements OnInit {
  @Input() set id(id: number) {}

  inputFormContent: { type: string; content: string; start: number }[] = [];

  html = `<h1>Hello world!dsds</h1><p>--TOC--</p><h1>Hello world!dsds</h1><h1>Hello world!dsds</h1><h1>Je suis une autre titre</h1><code>dsds</code><p style="text-align:center"><img src="https://imgs.search.brave.com/xZTkrGArJ_Tw3ld7KE0NfkhHppQa814cO-Ffj35TwlI/rs:fit:500:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/ZnJlZS1waG90by9t/b3VudGFpbi12aWV3/LWFpLWdlbmVyYXRl/ZC1pbWFnZV8yNjg4/MzUtNjk3MS5qcGc_/c2l6ZT02MjYmZXh0/PWpwZw" alt="" title=""><p>Je suis une text</p><h1>Je suis encore un autre titre</h1><p>e Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression. Le Lorem Ipsum est le faux texte standard de l\'imprimerie depuis les années 1500, quand un imprimeur anonyme assembla ensemble des morceaux de texte pour réaliser un livre spécimen de polices de texte. Il n\'a pas fait que survivre cinq siècles,</p>`;

  ngOnInit(): void {
    // provisoire, passer par un signal
    let match;
    const h1Regex = /<h1[^>]*>[\s\S]*?<\/h1>/gi;
    const pRegex = /<p[^>]*>[\s\S]*?<\/p>/gi;
    const baliseRegex = /<\/?[^>]+(>|$)/g;

    while ((match = h1Regex.exec(this.html)) !== null) {
      this.inputFormContent.push({
        type: 'h1',
        content: match[0].replace(baliseRegex, ''),
        start: match.index,
      });
    }

    while ((match = pRegex.exec(this.html)) !== null) {
      this.inputFormContent.push({
        type: 'p',
        content: match[0].replace(baliseRegex, ''),
        start: match.index,
      });
    }

    this.inputFormContent.sort((a, b) => a.start - b.start);
    console.log(this.inputFormContent);
  }
}
