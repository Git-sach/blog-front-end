import { environment } from '../../../environments/environment';

export class Post {
  constructor(
    public id?: number,
    public title: string = '',
    public resum: string = '',
    public content: string = '',
    public coverImageName: string = '',
    public keywords: string[] = [],
    public readTime: number | null = null,
    public date: Date = new Date(),
  ) {}

  get coverImageUrl(): string {
    const baseUrl = environment.blogBaseUrl;
    return `${baseUrl}/public/image/${this.id}/${this.coverImageName}`;
  }
}
