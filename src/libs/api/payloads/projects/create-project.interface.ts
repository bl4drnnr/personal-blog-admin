export interface CreateProjectPayload {
  projectTitle: string;
  projectDescription: string;
  projectContent: string;
  projectTags: Array<string>;
  projectFeaturedImageId: string;
  projectPublished: boolean;
}
