export interface CategoryData {
  categoryList: CategoryInfo[];
  total: number;
}
export interface CategoryInfo {
  id: number;
  categoryName: string;
  categoryImage: string;
  create_time: string;
  update_time: string;
}

export interface QueryParams {
  categoryName: string;
  currentPage: number;
  pageSize: number;
}
export interface CategoryForm {
  id: number[] | number | string;
  categoryName: string;
  categoryImage: string;
}
