export interface Post {
  id: number;
  title: string;
  resum: string;
  content: string;
  coverImagePath: string;
  keywords: string | string[];
  readTime: number;
  date: Date;
}
