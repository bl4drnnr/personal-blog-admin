import { NewsletterSubscription } from '@interfaces/newsletter/newsletter-subscription.interface';

export interface ListSubscriptionsResponse {
  count: number;
  rows: Array<NewsletterSubscription>;
}
