import { environment } from '../../../environments/environment';

export class Post {
  private baseUrl = environment.blogBaseUrl;

  constructor(
    public id: number,
    public title: string = '',
    public resum: string = '',
    public content: string = '',
    public coverImageName: string = '',
    public keywords: string[] = [],
    public readTime: number,
    public date: Date = new Date()
  ) {}

  get coverImageUrl(): string {
    return `${this.baseUrl}/image/${this.id}/${this.coverImageName}`;
  }
}
