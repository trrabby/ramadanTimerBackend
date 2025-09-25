export interface ICertificate {
  category: 'academic' | 'non-academic' | 'professional';
  institute: string;
  instituteLogo?: string;
  nameOfDegree: string;
  nameOfMajor?: string;
  startDate: Date;
  endDate?: Date;
  currentlyStuding?: boolean;
  details: HTMLElement | string;
  certificateLink?: string;
  credentialLink?: string;
  thumbnails?: string[];
  featured?: boolean;
  isDeleted?: boolean;
  createdAt?: Date;
}
