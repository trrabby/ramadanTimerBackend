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
      isDeleted?: boolean;
      updatedAt?: Date;
    },
  ];
  vote?: 'like' | 'dislike' | null;
  createdAt?: Date;
  updatedAt?: Date;
}
