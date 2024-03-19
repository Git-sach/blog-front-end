export class Post {
  constructor(
    public id: number,
    public title: string = '',
    public resum: string = '',
    public content: string = '',
    public coverImagePath: string = '',
    public keywords: string[] = [],
    public readTime: number,
    public date: Date = new Date()
  ) {}
}
