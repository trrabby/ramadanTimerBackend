export interface IProject {
  projTitle: string;
  liveLInk: string;
  serverLink: string;
  clientLink: string;
  shortDescription: string;
  descriptionOfProject: string;
  stackUsed: string[];
  thumbnails: string[];
  specialRemarks?: string;
  featured?: boolean;
  isDeleted?: boolean;
  createdAt?: Date;
}
