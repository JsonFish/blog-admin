export interface Response {
  code: number;
  message: string;
}
export interface GetTagResponse extends Response {
  data: TagData;
}
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
export interface OtherTagResponse extends Response {
  data: any;
}
export interface QueryParams {
  tagName: string;
  currentPage: number;
  pageSize: number;
}
export interface TagForm {
  id: number[] | number | string;
  tagName: string;
}
