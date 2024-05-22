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
}

/**
 * 1. Methode qui extrait les tags HTML (propriétée ?) et retourn le text sans les tags (propriétée ?) Faire dans le constructor ?
 * 2. Methode qui split a l'index souhaité (return 2 new InputHTMLTextProcessor dans un tableau)
 * 3. Methode qui merge (return 1 new InputHTMLTextProcessor)
 */
