import { SocialInterface } from '@interfaces/social.interface';
import { ListCertification } from '@interfaces/list-certification.interface';
import { FullExperience } from '@interfaces/full-experience.interface';

export interface GetSelectedAuthorResponse {
  id: string;
  firstName: string;
  lastName: string;
  title: string;
  description: string;
  profilePicture: string;
  isSelected: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  socials: Array<SocialInterface>;
  certs: Array<ListCertification>;
  experiences: Array<FullExperience>;
}
