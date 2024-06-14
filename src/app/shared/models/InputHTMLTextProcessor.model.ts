export const INSERTABLE_SPACE_CHAR = '&nbsp;';
export const SPACE_CHAR = ' ';

export class InputHTMLTextProcessor {
  private _savedHTMLTags: { type: string; start: number; end: number }[] = [];
  private _innerText: string = '';

  constructor(private _innerHTML: string) {
    this.extractHTMLStyleTagsAndSaveTextWithoutTags();
  }

  private extractHTMLStyleTagsAndSaveTextWithoutTags() {
    const HTMLStyleTags = ['strong', 'u', 'b', 'i', 'em'];
    let text = this._innerHTML;

    HTMLStyleTags.map((tag) => {
      const leftTag = `<${tag}>`;
      const rightTag = `<${tag}>`;
      while (text.includes(leftTag)) {
        this._savedHTMLTags.push({
          type: tag,
          start: text.indexOf(leftTag),
          end: text.indexOf(rightTag) - leftTag.length,
        });
        text = text.replace(leftTag, '');
        text = text.replace(rightTag, '');
      }
    });

    this._innerText = text;
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
    return this._innerText.replace(new RegExp(INSERTABLE_SPACE_CHAR, 'g'), ' ');
  }

  private placeInsertableSpacesInText(text: string): string {
    let replacedText = text;

    if (text.startsWith(SPACE_CHAR)) replacedText = INSERTABLE_SPACE_CHAR + replacedText.slice(1);
    if (text.endsWith(SPACE_CHAR)) replacedText = replacedText.slice(0, -1) + INSERTABLE_SPACE_CHAR;

    return replacedText;
  }

  public get innerText() {
    return this._innerText;
  }

  public get innerHTML() {
    return this._innerHTML;
  }
}
