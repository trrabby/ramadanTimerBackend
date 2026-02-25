export interface IFeedback {
  author: string;
  email?: string;
  feedback: string;
  rating: number;
  createdAt?: Date;
  updatedAt?: Date;
}
