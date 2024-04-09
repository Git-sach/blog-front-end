type ContentInputType = 'h1' | 'p';

export class ContentInput {
  constructor(public readonly type: ContentInputType, public readonly content: string, public readonly start: number) {}
}

/**
 * Immutable class representing content inputs.
 * Creates new instances at each operation to simplify state management by allowing updates without direct state mutation.
 */
export class ContentInputCollection {
  constructor(private readonly _contentInputCollection: ContentInput[] = []) {
    this._contentInputCollection = _contentInputCollection;
  }

  /**
   * Creates a copy of the ContentInputCollection object.
   * @returns A new instance of ContentInputCollection with copied content inputs.
   */
  private clone(): ContentInputCollection {
    const contentInputCollectionCopy = this._contentInputCollection.map((contentInput) => ({ ...contentInput }));
    return new ContentInputCollection(contentInputCollectionCopy);
  }

  /**
   * Adds a content input at the specified index.
   * @param contentInput ContentInput to add.
   * @param index Index at which to add the content input.
   * @returns A new instance of ContentInputCollection with the added content input.
   */
  public addContentInput(
    contentInput: ContentInput,
    index: number = this._contentInputCollection.length,
  ): ContentInputCollection {
    const inputsCopy = this.clone();
    inputsCopy._contentInputCollection.splice(index, 0, contentInput);
    return inputsCopy;
  }

  /**
   * Deletes the content input at the specified index.
   * @param index Index of the content input to delete.
   * @returns A new instance of ContentInputCollection with the deleted content input.
   */
  public deleteContentInput(index: number = this._contentInputCollection.length): ContentInputCollection {
    const inputsCopy = this.clone();
    inputsCopy._contentInputCollection.splice(index, 1);
    return inputsCopy;
  }

  /**
   * Updates the content input at the specified index with the provided content input.
   * @param index Index of the content input to update.
   * @param contentInput New content input.
   * @returns A new instance of ContentInputCollection with the updated content input.
   */
  public updateAContentInput(index: number, contentInput: ContentInput): ContentInputCollection {
    const inputsCopy = this.clone();
    inputsCopy._contentInputCollection[index] = contentInput;
    return inputsCopy;
  }

  /**
   * Sorts the content inputs based on their start positions.
   * @returns A new instance of ContentInputCollection with the sorted content inputs.
   */
  public sort(): ContentInputCollection {
    const inputsCopy = this.clone();
    inputsCopy._contentInputCollection.sort((a, b) => a.start - b.start);
    return inputsCopy;
  }

  /**
   * Getter for accessing the content inputs.
   * @returns Array of content inputs.
   */
  get contentInputCollection(): ContentInput[] {
    return this._contentInputCollection;
  }
}
