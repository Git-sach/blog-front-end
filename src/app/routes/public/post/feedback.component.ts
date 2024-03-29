import { Component } from '@angular/core';
import { FeedbackFormComponent } from '../../../shared/ui/feedback-form.component';

@Component({
  selector: 'app-feedback',
  standalone: true,
  template: `<app-feedback-form></app-feedback-form> `,
  styles: ``,
  imports: [FeedbackFormComponent],
})
export class FeedbackComponent {}
