export interface ListProjectInterface {
  id: string;
  projectDescription: string;
  projectImage: string;
  projectName: string;
  projectSlug: string;
  projectTags: Array<string>;
  projectPosted: boolean;
  createdAt: Date;
  updatedAt: Date;
  content: string;
  featured: boolean;
}
