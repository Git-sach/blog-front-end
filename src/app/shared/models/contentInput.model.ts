import { InputHTMLTextProcessor } from './InputHTMLTextProcessor.model';

type ContentInputType = 'h1' | 'p' | 'srcImg';

export class ContentInput {
  constructor(
    private readonly _type: ContentInputType,
    private readonly _content: InputHTMLTextProcessor,
    private readonly _start: number,
    private _id: number | null = null,
  ) {}

  public clone(): ContentInput {
    return new ContentInput(this._type, this._content, this._start, this.id);
  }

  public get type(): ContentInputType {
    return this._type;
  }

  public get content(): InputHTMLTextProcessor {
    return this._content;
  }

  public get start(): number {
    return this._start;
  }

  public set id(id: number) {
    this._id = id;
  }

  public get id(): number | null {
    return this._id;
  }
}
