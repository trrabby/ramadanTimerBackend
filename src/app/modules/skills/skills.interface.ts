export interface ISkill {
  imgUrl: string;
  skillName: string;
  genre:
    | 'programming_language'
    | 'frontend'
    | 'backend'
    | 'database'
    | 'devops'
    | 'tools'
    | 'other';
  description?: string;
  isDeleted?: boolean;
  createdAt?: Date;
}
