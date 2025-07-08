export interface IProject {
  projTitle: string;
  liveLInk: string;
  serverLink: string;
  clientLink: string;
  shortDescription: string;
  descriptionOfProject: string;
  thumbnails: string[];
  isDeleted?: boolean;
  createdAt?: Date;
}
