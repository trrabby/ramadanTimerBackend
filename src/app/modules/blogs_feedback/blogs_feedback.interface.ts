import { Types } from 'mongoose';
export interface IBlog_Feedback {
  blog: Types.ObjectId;
  feedback_by:
    | Types.ObjectId
    | { name: string; email: string; imgUrl: string; role: string };
  feedback?: string;
  vote?: 'like' | 'dislike' | null;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
