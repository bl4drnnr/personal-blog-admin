import { ListCertification } from '@interfaces/list-certification.interface';
import { ListExperience } from '@interfaces/list-experience.interface';
import { SocialInterface } from '@interfaces/social.interface';

export interface GetAuthorByIdResponse {
  id: string;
  firstName: string;
  lastName: string;
  title: string;
  description: string;
  profilePicture: string;
  isSelected: boolean;
  authorLanguage: string;
  authorCommonId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  socials: Array<SocialInterface>;
  certs: Array<ListCertification>;
  experiences: Array<ListExperience>;
}
