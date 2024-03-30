import { Component } from '@angular/core';
import { FeedbackFormComponent } from '../../../shared/ui/feedback-form.component';

/**
 * Smart Component for feeback feature
 * @argument id The id of post
 */
@Component({
  selector: 'app-feedback',
  standalone: true,
  template: `<app-feedback-form></app-feedback-form> `,
  styles: ``,
  imports: [FeedbackFormComponent],
})
export class FeedbackComponent {}
