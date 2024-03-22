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
  public feedbackSubmited = false;

  public onClickNote(index: number) {
    this.removeNotes();
    this.notes[index].isActive = true;
  }

  public onCancel() {
    this.removeNotes();
  }

  public onSubmit() {
    this.feedbackSubmited = true;
  }

  public removeNotes() {
    this.notes.forEach((note) => {
      note.isActive = false;
    });
  }
}
