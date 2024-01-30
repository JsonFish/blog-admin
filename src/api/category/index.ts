import { http } from "@/utils/http";
import type {
  GetCategoryResponse,
  QueryParams,
  CategoryForm,
  OtherCategoryResponse
} from "./type";
/** 获取专栏 */
export const getCategoryList = (params: QueryParams) => {
  return http.request<GetCategoryResponse>("get", "/category", { params });
};
/** 添加专栏 */
export const addCategory = (data: CategoryForm) => {
  return http.request<OtherCategoryResponse>("post", "/category", { data });
};
/** 修改专栏 */
export const updateCategory = (data: CategoryForm) => {
  return http.request<OtherCategoryResponse>("put", "/category", { data });
};
/** 删除专栏 */
export const deleteCategory = (data: CategoryForm) => {
  return http.request<OtherCategoryResponse>("delete", "/category", {
    data
  });
};
