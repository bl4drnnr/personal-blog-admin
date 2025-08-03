export interface WhyBlock {
  text: string;
}

export interface FeatureItem {
  title: string;
}

export interface WhysSection {
  id: string;
  title: string;
  whyBlocks: WhyBlock[];
  features: FeatureItem[];
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWhysSectionData {
  title: string;
  whyBlocks: WhyBlock[];
  features: FeatureItem[];
  featured?: boolean;
}

export interface UpdateWhysSectionData {
  title?: string;
  whyBlocks?: WhyBlock[];
  features?: FeatureItem[];
  featured?: boolean;
}
