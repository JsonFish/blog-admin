export interface Response {
  code: number;
  message: string;
}
export interface GetCategoryResponse extends Response {
  data: CategoryData;
}
export interface CategoryData {
  categoryList: CategoryInfo[];
  total: number;
}
export interface CategoryInfo {
  id: number;
  categoryName: string;
  create_time: string;
  update_time: string;
}
export interface OtherCategoryResponse extends Response {
  data: any;
}
export interface QueryParams {
  categoryName: string;
  currentPage: number;
  pageSize: number;
}
export interface CategoryForm {
  id: number[] | number | string;
  categoryName: string;
}
