import { Injectable } from '@angular/core';
import { BasePostFacade } from '../../../core/facade/base-post.facade';

/**
 * Facade for the edit Post page
 */
@Injectable({
  providedIn: 'root',
})
export class EditFacade extends BasePostFacade {}
