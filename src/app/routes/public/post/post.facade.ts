import { Injectable } from '@angular/core';
import { BasePostFacade } from '../../../core/facade/base-post.facade';

/**
 * Facade for the Post page
 */
@Injectable({
  providedIn: 'root',
})
export class PostFacade extends BasePostFacade {}
