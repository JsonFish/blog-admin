export interface QueryParams {
  id?: number | string | string[];
  articleTitle?: string;
  currentPage?: number;
  pageSize?: number;
  status?: number;
}

export interface ArticleData {
  articleList: ArticleInfo[];
  total: number;
}

export interface ArticleInfo {
  articleContent: string;
  articleCover: string;
  articleSummary: string;
  articleTitle: string;
  author: string;
  browse?: number;
  categoryId: number;
  categoryName?: string;
  create_time?: string;
  id: number | string;
  isTop: number;
  order: number;
  originUrl: string;
  status: number;
  tagIds: number[];
  tags?: Tag[];
  type: number;
  update_time?: string;
  upvote?: number;
}
/**
 * Request
 */
export interface Tag {
  tagName: string;
}
