import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LayoutComponent } from '../../../core/containers/layout/layout.component';
import { PostListComponent } from './post-list.component';

/**
 * Routed component for the Home page
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [PostListComponent, LayoutComponent, AsyncPipe],
  template: `
    <app-layout>
      <h1>Le Blog</h1>
      <p>
        Ici, nous plongeons dans l'univers captivant du développement web et
        démystifions les concepts essentiels de programmation dans le but de
        perfectionner notre art du code.
      </p>
      <div style="margin: 30px 0 40px 0" class="separator"></div>
      <app-post-list></app-post-list>
    </app-layout>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {}
