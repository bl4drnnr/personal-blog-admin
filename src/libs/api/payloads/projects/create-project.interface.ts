export interface CreateProjectPayload {
  projectTitle: string;
  projectDescription: string;
  projectContent: string;
  projectTags: Array<string>;
  projectMetaKeywords: string;
  projectType: string;
  projectFeaturedImageId: string;
  projectPublished: boolean;
}
