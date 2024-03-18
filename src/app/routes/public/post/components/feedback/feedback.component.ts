import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NOTES } from './notes';

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [],
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeedbackComponent {
  public notes = NOTES;

  public onClick(index: number) {
    this.notes.forEach((note) => {
      note.isActive = false;
    });
    this.notes[index].isActive = true;
  }
}
