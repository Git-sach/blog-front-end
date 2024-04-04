import { Component, input } from '@angular/core';
import { Editor, NgxEditorModule, Toolbar } from 'ngx-editor';
import { EditPostContentComponent } from './edit-post-content.component';

@Component({
  selector: 'app-edit-post',
  standalone: true,
  imports: [NgxEditorModule, EditPostContentComponent],
  template: ` <app-edit-post-content></app-edit-post-content> `,
  styles: ``,
})
export class EditComponent {
  id = input<string>();

  /**
   * Componeent provisoire
   * Faire la facade et le container
   * puis ajouter le gard
   * Component destiner a ête DUMB
   *
   * RouteComponent -> Récupère l'id
   * SmartComponent -> Faire un tableau, map d'inputs avec h1, h2, Code, img, information block ?
   * DumpComponent -> Récupère ce tableau pour l'afficher / Une fois un input deselectionner le persister ?
   *
   * Tableau d'input:
   * [
   *  {
   *   type: h1,
   *   value: "truc"
   *  }
   *
   * ]
   */

  editor!: Editor;
  toolbar: Toolbar = [
    // default value
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
    ['horizontal_rule', 'format_clear'],
  ];

  ngOnInit(): void {
    this.editor = new Editor();
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }
}
