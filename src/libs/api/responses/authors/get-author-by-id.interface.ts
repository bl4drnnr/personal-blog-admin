import { ListCertification } from '@interfaces/list-certification.interface';
import { SocialResponse } from '@interfaces/social-response.interface';

export interface GetAuthorByIdResponse {
  id: string;
  firstName: string;
  lastName: string;
  description: string;
  profilePicture: string;
  isSelected: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  socials: Array<SocialResponse>;
  certs: Array<ListCertification>;
  // experiences: Array<>;
}
