import { ContentInput } from './contentInput.model';
import { InputHTMLTextProcessor } from './InputHTMLTextProcessor.model';

/**
 * Immutable class representing content inputs.
 * Creates new instances at each operation to simplify state management by allowing updates without direct state mutation.
 */
export class ContentInputCollection {
  private collectionMaxId = 0;

  constructor(private readonly _collectionValue: ContentInput<string | InputHTMLTextProcessor>[] = []) {
    let contentInputCollectionCopy: ContentInput<string | InputHTMLTextProcessor>[] = [];

    // Trouver le collectionMaxId
    _collectionValue.forEach((contentInput) => {
      if (contentInput.id && contentInput.id > this.collectionMaxId) {
        this.collectionMaxId = contentInput.id;
      }
    });

    // Clone of contentCollectionInput + set null ids
    _collectionValue.forEach((contentInput) => {
      let contentInputCopy = contentInput.clone();
      contentInputCollectionCopy.push(contentInputCopy);
    });

    this._collectionValue = contentInputCollectionCopy;
  }

  /**
   * Creates a copy of the ContentInputCollection object.
   * @returns A new instance of ContentInputCollection with copied content inputs.
   */
  private clone(): ContentInputCollection {
    return new ContentInputCollection(this._collectionValue);
  }

  /**
   * Adds a content input at the specified index.
   * @param contentInput ContentInput to add.
   * @param index Index at which to add the content input.
   * @returns A new instance of ContentInputCollection with the added content input.
   */
  public addContentInput(
    contentInput: ContentInput<string | InputHTMLTextProcessor>,
    index: number = this._collectionValue.length,
  ): ContentInputCollection {
    const contentInputCollectionCopy = this.clone();
    const contentInputCopy = contentInput.clone();

    contentInputCollectionCopy.collectionMaxId++;
    contentInputCopy.id = contentInputCollectionCopy.collectionMaxId;

    contentInputCollectionCopy._collectionValue.splice(index, 0, contentInputCopy);
    return contentInputCollectionCopy;
  }

  /**
   * Deletes the content input at the specified index.
   * @param index Index of the content input to delete.
   * @returns A new instance of ContentInputCollection with the deleted content input.
   */
  public deleteContentInput(index: number = this._collectionValue.length): ContentInputCollection {
    const contentInputCollectionCopy = this.clone();
    contentInputCollectionCopy._collectionValue.splice(index, 1);
    return contentInputCollectionCopy;
  }

  /**
   * Updates the content input at the specified index with the provided content input.
   * @param index Index of the content input to update.
   * @param contentInput New content input.
   * @returns A new instance of ContentInputCollection with the updated content input.
   */
  public updateAContentInput(index: number, contentInput: ContentInput<string | InputHTMLTextProcessor>): ContentInputCollection {
    const contentInputCollectionCopy = this.clone();
    contentInput.id = contentInputCollectionCopy._collectionValue[index].id!;
    contentInputCollectionCopy._collectionValue[index] = contentInput;
    return contentInputCollectionCopy;
  }

  /**
   * Sorts the content inputs based on their start positions.
   * @returns A new instance of ContentInputCollection with the sorted content inputs.
   */
  public sort(): ContentInputCollection {
    const contentInputCollectionCopy = this.clone();
    contentInputCollectionCopy._collectionValue.sort((a, b) => a.start - b.start);
    return contentInputCollectionCopy;
  }

  /**
   * Getter for accessing the content inputs.
   * @returns Array of content inputs.
   */
  get collectionValue(): ContentInput<string | InputHTMLTextProcessor>[] {
    return this._collectionValue;
  }
}
