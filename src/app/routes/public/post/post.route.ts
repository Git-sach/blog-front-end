import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LayoutComponent } from '../../../core/containers/layout/layout.component';
import { DynamicTableOfContentDirective } from '../../../shared/directives/table-of-content.directive';
import { PostDisplayComponent } from '../../../shared/ui/post-display.component';
import { FeedbackComponent } from './feedback.component';
import { PostViewComponent } from './post-view.component';

/**
 * Routed component for the Home page
 */

//TODO: Rename post-content en post-content-ui ?
// fair un smart component post-view qui interagit avec la facade
// Faire un smart component feedback qui affiche feedback-form
@Component({
  selector: 'app-post',
  standalone: true,
  imports: [
    LayoutComponent,
    DynamicTableOfContentDirective,
    PostDisplayComponent,
    AsyncPipe,
    PostViewComponent,
    RouterLink,
    FeedbackComponent,
  ],
  template: `
    <app-layout>
      <div class="post_view_container">
        <div
          [routerLink]="['/home']"
          routerLinkActive="router-link-active"
          class="button outline size2"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 10L4 15L9 20"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M20 4V11C20 12.0609 19.5786 13.0783 18.8284 13.8284C18.0783 14.5786 17.0609 15 16 15H4"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          Accueil
        </div>
        @if (id(); as id) {
        <app-post-view [id]="id"></app-post-view>
        <app-feedback></app-feedback>
        }
      </div>
    </app-layout>
  `,
  styles: `
  .post_view_container {
    display: flex;
    flex-direction: column;
    gap: 30px;
  
    // .feedback {
    //   padding-top: 5vh;
    //   padding-bottom: 5vh;
    //   width: 70%;
    //   margin: auto;
    // }
  }
  
  @media screen and (max-width: 725px) {
    .post_view_container {
      .feedback {
        width: 100%;
      }
    }
  }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostComponent {
  id = input<string>();
}
