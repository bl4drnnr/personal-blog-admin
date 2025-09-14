export interface ListProjectInterface {
  id: string;
  projectDescription: string;
  projectImage: string;
  projectName: string;
  projectSlug: string;
  projectTags: Array<string>;
  metaKeywords: string;
  projectType: string;
  projectPosted: boolean;
  createdAt: Date;
  updatedAt: Date;
  content: string;
  featured: boolean;
}
