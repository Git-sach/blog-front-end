import { Component, input } from '@angular/core';
import { NgxEditorModule } from 'ngx-editor';
import { LayoutComponent } from '../../../core/containers/layout/layout.component';
import { EditPostContentComponent } from './edit-post-content.component';

@Component({
  selector: 'app-edit-post',
  standalone: true,
  imports: [NgxEditorModule, EditPostContentComponent, LayoutComponent],
  template: ` <app-layout>
    @if (id(); as id) {
    <app-edit-post-content [id]="id"></app-edit-post-content>
    }
  </app-layout>`,
  styles: ``,
})
export class EditComponent {
  id = input<string>();
}
