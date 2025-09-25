export interface IBlog {
  title: string;
  category: string;
  author: string;
  authorImg?: string;
  authorEmail: string;
  tags: string[];
  content: HTMLElement | string;
  coverImage: string;
  thumbnails: string[];
  featured?: boolean;
  isDeleted?: boolean;
  createdAt?: Date;
}
