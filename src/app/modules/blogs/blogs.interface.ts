import { Types } from 'mongoose';
export interface IBlog {
  title: string;
  category: string;
  author:
    | Types.ObjectId
    | { name: string; email: string; imgUrl: string; role: string };
  tags: string[];
  content: HTMLElement | string;
  coverImage: string;
  previousUploadedImg?: string[];
  thumbnails: string[];
  featured?: boolean;
  isPublished?: boolean;
  feedbacks?: Types.ObjectId[];
  isDeleted?: boolean;
  createdAt?: Date;
}
