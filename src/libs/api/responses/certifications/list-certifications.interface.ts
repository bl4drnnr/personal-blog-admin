import { ListCertification } from '@interfaces/list-certification.interface';

export interface ListCertificationsResponse {
  count: number;
  rows: Array<ListCertification>;
}
