export interface TagData {
  tagList: TagInfo[];
  total: number;
}
export interface TagInfo {
  id: number;
  tagName: string;
  create_time: string;
  update_time: string;
}
export interface QueryParams {
  tagName: string;
  currentPage: number;
  pageSize: number;
}
export interface TagForm {
  id?: number;
  tagName: string;
}
export interface DeleteParams {
  id: number[];
}
