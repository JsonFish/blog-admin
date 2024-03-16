export interface QueryParmars {
  siteName: string;
  currentPage: number;
  pageSize: number;
  status: number;
}

export interface LinkData {
  linkList: LinkInfo[];
  total: number;
}

export interface LinkInfo {
  applicant?: string;
  createTime?: string;
  id: number;
  siteAvatar: string;
  siteDesc: string;
  siteName: string;
  siteUrl: string;
  status?: number;
  updateTime?: string;
}
