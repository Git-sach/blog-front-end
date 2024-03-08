export interface Post {
  id: number;
  title: string;
  resum: string;
  content: string;
  coverImagePath: string;
  keywords: Keyword[];
  readTime: number;
  date: Date;
}

export interface Keyword {
  id: number;
  name: string;
}
