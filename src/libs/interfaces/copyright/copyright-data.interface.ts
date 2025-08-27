export interface CopyrightLinkInterface {
  title: string;
  link: string;
}

export interface CopyrightData {
  copyrightEmail: string;
  copyrightText: string;
  copyrightLinks: CopyrightLinkInterface[];
}

export interface UpdateCopyrightDataRequest {
  copyrightEmail?: string;
  copyrightText?: string;
  copyrightLinks?: CopyrightLinkInterface[];
}

export interface UpdateCopyrightDataResponse {
  success: boolean;
  message: string;
}
