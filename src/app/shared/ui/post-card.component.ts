import { DatePipe } from '@angular/common';
import { Component, EventEmitter, input, Output } from '@angular/core';
import { Post } from '../models/post.model';

/**
 * A presentational component for display a post card
 * @argument post The post to display
 */
@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [DatePipe],
  template: ` <div (click)="onClick(post())" class="post">
    <div class="left_side">
      <img [src]="post().coverImageUrl" />
    </div>
    <div class="right_side">
      <div class="title_resum">
        <h1 class="title">
          {{ post().title }}
        </h1>
        <p class="resum">
          {{ post().resum }}
        </p>
      </div>
      <div class="keywords_date_readTime">
        <div class="keywords">
          @for(keyword of post().keywords; track keyword) {
          <div class="keyword">
            {{ keyword }}
          </div>
          }
        </div>
        <div class="date_readTime">
          <p class="date">{{ post().date | date : 'dd MMMM yyyy' }}</p>
          <div class="readTime_container">
            <img src="assets/svg/timer.svg" />
            <p>{{ post().readTime }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>`,
  styles: `
  $widthPost: 480px;
  .post {
    cursor: pointer;
    border: 1px solid var(--grey_subtle_borders_separators);
    transition: 0.2s;
    border-radius: 5px;
    display: flex;
    .left_side {
      width: calc($widthPost/2);
      img {
        width: 100%;
        display: block;
      }
    }
    .right_side {
      width: calc($widthPost/2);
      padding: 10px 15px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .title_resum {
        .title {
          margin: 0;
          font-size: 1.1rem;
          font-weight: 700;
        }
        .resum {
          font-size: 0.8rem;
        }
      }
      .keywords_date_readTime {
        font-size: 0.7rem;
        p {
          margin: 0;
        }
        .keywords {
          display: flex;
          gap: 5px;
          flex-wrap: wrap;
          margin-bottom: 10px;
          .keyword {
            color: var(--grey_low_contrast_text);
            border: 1px solid var(--grey_subtle_borders_separators);
            border-radius: 5px;
            padding: 2px 10px;
            white-space: nowrap;
          }
        }
        .date_readTime {
          display: flex;
          justify-content: space-between;
          .readTime_container {
            display: flex;
          }
        }
      }
    }
    &:hover {
      border: 1px solid var(--grey_hovered_solid_backgrounds);
    }
  }


@media screen and (max-width: 725px) {
    .post {
      .left_side {
        width: 40%;
      }
      .right_side {
        width: 60%;
      }
    }
}

@media screen and (max-width: 425px) {
    .post {
      .right_side {
        .title_resum {
          .title {
            font-size: 0.9rem;
          }
        }
        .keywords_date_readTime {
          font-size: 0.5rem;
        }
      }
    }
  }
`,
})
export class PostCardComponent {
  post = input.required<Post>();
  @Output() clickPostEmitter = new EventEmitter();

  onClick(post: Post) {
    this.clickPostEmitter.emit(post);
  }
}
