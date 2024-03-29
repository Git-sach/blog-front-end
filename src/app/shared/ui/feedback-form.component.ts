import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NOTES } from './notes';

@Component({
  selector: 'app-feedback-form',
  standalone: true,
  imports: [],
  template: `
    <div class="container">
      <div class="header">
        <p>Donne ton avis sur ce post !</p>
      </div>
      @if(feedbackSubmited) {
      <p>Merci pour ce retour !</p>
      }@else {
      <div class="notes">
        @for(note of notes; track note.name; let index = $index){
        <div
          (click)="onClickNote(index)"
          class="note"
          [classList]="note.isActive ? 'active note' : 'note'"
        >
          <img [src]="note.svgPath" alt="Note Icon" />
          <p>{{ note.name }}</p>
        </div>
        }
      </div>
      <div class="footer">
        <div class="button outline size1" (click)="onCancel()">Annuler</div>
        <div class="button solid size1" (click)="onSubmit()">Soumettre</div>
      </div>
      }
    </div>
  `,
  styles: `
  .container {
    border: 1px solid var(--grey_subtle_borders_separators);
    width: 100%;
    max-width: 600px;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    padding: 4vh 2vw;
    margin: auto;
    .header {
      p {
        font-size: 1.3rem;
        margin: 0;
      }
    }
    .notes {
      width: 100%;
      display: flex;
      justify-content: space-between;
      .note {
        cursor: pointer;
        border-radius: 5px;
        padding: 3% 0 0 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 17%;
        border: 1px solid var(--grey_subtle_borders_separators);
        transition: 0.1s;
        img {
          width: 45%;
          height: 45%;
          transition: 0.3s;
        }
        &:hover {
          background-color: var(--subtle_background);
          img {
            transform: rotate(5deg);
          }
        }
        p {
          // font-size: 1.6vw;
          font-size: clamp(0.5em, 1.3vw, 1em);
        }
        &.active {
          background-color: var(--subtle_background);
          border: 1px solid var(--hovered_ui_element_border);
        }
      }
    }
    .footer {
      display: flex;
      align-self: flex-end;
      gap: 20px;
    }
  }
  
  @media screen and (max-width: 725px) {
    .container {
      // On fait des boutons qui prennent toute la largeure
      .footer {
        width: 100%;
        .button {
          width: 100%;
        }
      }
    }
  }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeedbackFormComponent {
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
