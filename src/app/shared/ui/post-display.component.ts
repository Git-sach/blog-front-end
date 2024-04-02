import { DatePipe } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';

import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';
import { DynamicTableOfContentDirective } from '../directives/table-of-content.directive';
import { Post } from '../models/post.model';

/**
 * A presentational component for display a post details
 * @argument post The post to display
 */
@Component({
  selector: 'app-post-display',
  standalone: true,
  imports: [DatePipe, DynamicTableOfContentDirective],
  template: `
    <div class="content">
      <div class="post_header">
        <div class="left_side">
          <img [src]="post().coverImageUrl" />
        </div>
        <div class="right_side">
          <div class="title_resum">
            <h1 class="title">
              {{ post().title }}
            </h1>
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
              <p class="date">
                {{ post().date | date : 'dd MMMM yyyy' }}
              </p>
              <div class="readTime_container">
                <img src="assets/svg/timer.svg" />
                <p>{{ post().readTime }}min</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style="margin-bottom: 30px" class="separator"></div>
      <div
        class="post_content"
        dynamicTableOfContent
        [innerHTML]="post().content"
      ></div>
    </div>
  `,
  styles: `
  .content {
    .post_header {
      border-radius: 5px;
      display: flex;
      margin-bottom: 50px;
      .left_side {
        width: 30%;
        img {
          width: 100%;
          display: block;
        }
      }
      .right_side {
        width: 70%;
        padding: 10px 0px 10px 50px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .title_resum {
          .title {
            margin: 0;
            font-size: 3.1rem;
            font-weight: 700;
          }
        }
        .keywords_date_readTime {
          font-size: 1rem;
          p {
            margin: 0;
          }
          .keywords {
            display: flex;
            gap: 5px;
            flex-wrap: wrap;
            margin-bottom: 30px;
            .keyword {
              color: var(--grey_low_contrast_text);
              border: 1px solid var(--grey_subtle_borders_separators);
              border-radius: 5px;
              padding: 5px 10px;
              white-space: nowrap;
            }
          }
          .date_readTime {
            width: 100%;
            display: flex;
            justify-content: space-between;
            .readTime_container {
              display: flex;
              img {
                width: 20px;
              }
            }
          }
        }
      }
    }
  }
  
  @media screen and (max-width: 1050px) {
    .content {
      .post_header {
        .right_side {
          padding: 10px 0px 10px 20px;
          .title_resum {
            .title {
              font-size: 2rem;
            }
          }
          .keywords_date_readTime {
            font-size: 0.6rem;
            .keywords {
              margin-bottom: 15px;
            }
            .date_readTime {
              .readTime_container {
                img {
                  width: 15px;
                }
              }
            }
          }
        }
      }
    }
  }
  
  @media screen and (max-width: 800px) {
    .content {
      .post_header {
        .right_side {
          padding: 0px 0px 0px 20px;
          .title_resum {
            .title {
              font-size: 1.5rem;
            }
          }
          .keywords_date_readTime {
            font-size: 0.6rem;
            .keywords {
              margin-bottom: 10px;
            }
            .date_readTime {
              .readTime_container {
                img {
                  width: 15px;
                }
              }
            }
          }
        }
      }
    }
  }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostDisplayComponent implements AfterViewInit {
  post = input.required<Post>();

  ngAfterViewInit(): void {
    hljs.registerLanguage('xml', xml);
    hljs.registerLanguage('typescript', typescript);
    hljs.registerLanguage('javascript', javascript);
    hljs.highlightAll();
  }
}
