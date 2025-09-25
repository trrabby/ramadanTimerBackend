export interface IExperience {
  category: string;
  institute: string;
  instituteLogo?: string;
  designation: string;
  startDate: Date;
  endDate?: Date;
  currentlyWorking?: boolean;
  details: HTMLElement | string;
  thumbnails?: string[];
  featured?: boolean;
  isDeleted?: boolean;
  createdAt?: Date;
}
