import { ContactMessage } from '@interfaces/contact/contact-message.interface';

export interface ListContactMessagesResponse {
  count: number;
  rows: Array<ContactMessage>;
}
