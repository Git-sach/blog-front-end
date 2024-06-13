export const INSERTABLE_SPACE_CHAR = '&nbsp;';
export const SPACE_CHAR = ' ';

export class InputHTMLTextProcessor {
  private _savedHTMLTags: { type: string; start: number; end: number }[] = [];
  private _text: string = '';

  constructor(private _HTMLText: string) {
    this.extractHTMLTag();
  }

  /**
   * Extracts HTML tags from a string and saves their positions while removing them from the input string.
   *
   * @param inputText The input string containing HTML tags.
   * @param savedTags An array to save the positions of the extracted tags.
   * @returns The input string with HTML tags removed.
   */
  private extractHTMLTag() {
    let text = this._HTMLText;

    while (text.includes(`<strong>`) === true || text.includes(`<u>`) === true) {
      let tagType = '';
      text.includes(`<strong>`) === true ? (tagType = 'strong') : (tagType = 'u');
      this._savedHTMLTags.push({
        type: tagType,
        start: text.indexOf(`<${tagType}>`),
        end: text.indexOf(`</${tagType}>`) - `<${tagType}>`.length, // - la longeure du <strong>
      });
      text = text.replace(`<${tagType}>`, '');
      text = text.replace(`</${tagType}>`, '');
    }
    this._text = text;
  }

  public splitInputHTMLTextAtIndex(index: number): InputHTMLTextProcessor[] {
    let spitedText = this.splitTextAtIndex(index);
    //TODO: Relpace les balises HTML aux bon endroits

    return [new InputHTMLTextProcessor(spitedText[0]), new InputHTMLTextProcessor(spitedText[1])];
  }

  private splitTextAtIndex(index: number): string[] {
    let textToSpit = this.replaceInsertableSpacesInText();
    let textBefore = this.placeInsertableSpacesInText(textToSpit.substring(0, index));
    let textAfter = this.placeInsertableSpacesInText(textToSpit.substring(index));
    return [textBefore, textAfter];
  }

  private replaceInsertableSpacesInText(): string {
    return this._text.replace(new RegExp(INSERTABLE_SPACE_CHAR, 'g'), ' ');
  }

  private placeInsertableSpacesInText(text: string): string {
    let replacedText = text;

    if (text.startsWith(SPACE_CHAR)) replacedText = INSERTABLE_SPACE_CHAR + replacedText.slice(1);
    if (text.endsWith(SPACE_CHAR)) replacedText = replacedText.slice(0, -1) + INSERTABLE_SPACE_CHAR;

    return replacedText;
  }

  public get text() {
    return this._text;
  }

  public get HTMLText() {
    return this._HTMLText;
  }
}

/**
 * 1. Methode qui extrait les tags HTML (propriétée ?) et retourn le text sans les tags (propriétée ?) Faire dans le constructor ?
 * 2. Methode qui split a l'index souhaité (return 2 new InputHTMLTextProcessor dans un tableau)
 * 3. Methode qui merge (return 1 new InputHTMLTextProcessor)
 */
