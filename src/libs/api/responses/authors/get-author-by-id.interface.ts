import { ListCertification } from '@interfaces/list-certification.interface';

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
  // @TODO
  // socials: Array<>;
  certs: Array<ListCertification>;
  // experiences: Array<>;
}
