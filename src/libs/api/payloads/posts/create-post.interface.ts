interface Subsection {
  name: string;
  content: string;
  subsections: Subsection[];
}

interface Section {
  name: string;
  content: string;
  subsections: Subsection[];
}

export interface CreatePostPayload {
  postName: string;
  postDescription: string;
  postTags: Array<string>;
  sections: Array<Section>;
}
