import { CertResponse } from '@responses/cert.interface';

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
  // socials: Array<>;
  certs: Array<CertResponse>;
  // experiences: Array<>;
}
