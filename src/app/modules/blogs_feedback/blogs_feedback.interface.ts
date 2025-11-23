import { Types } from 'mongoose';
export interface IBlog_Feedback {
  blog: Types.ObjectId;
  feedback_by:
    | Types.ObjectId
    | { name: string; email: string; imgUrl: string; role: string };
  feedback?: [
    {
      text?: string;
      createdAt?: Date;
    },
  ];
  vote?: 'like' | 'dislike' | null;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
