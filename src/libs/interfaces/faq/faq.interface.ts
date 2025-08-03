export interface Faq {
  id: string;
  question: string;
  answer: string;
  sortOrder: number;
  isActive: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FaqResponse {
  faqs: Faq[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateFaqData {
  question: string;
  answer: string;
  sortOrder?: number;
  isActive?: boolean;
  featured?: boolean;
}

export interface UpdateFaqData {
  question?: string;
  answer?: string;
  sortOrder?: number;
  isActive?: boolean;
  featured?: boolean;
}

export interface GetFaqsParams {
  page?: number;
  pageSize?: number;
  search?: string;
  isActive?: boolean;
  featured?: boolean;
  orderBy?: 'createdAt' | 'question' | 'sortOrder' | 'isActive' | 'featured';
  order?: 'ASC' | 'DESC';
}
