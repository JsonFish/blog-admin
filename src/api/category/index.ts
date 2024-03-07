import { http } from "@/utils/http";
import type { GetCategoryResponse, QueryParams, CategoryForm } from "./type";
/** 获取分类 */
export const getCategoryList = (params?: QueryParams) => {
  return http.request<GetCategoryResponse>("get", "/category", { params });
};
/** 添加分类 */
export const addCategory = (data: CategoryForm) => {
  return http.request<BaseResponse<any>>("post", "/category", { data });
};
/** 修改分类 */
export const updateCategory = (data: CategoryForm) => {
  return http.request<BaseResponse<any>>("put", "/category", { data });
};
/** 删除分类 */
export const deleteCategory = (data: CategoryForm) => {
  return http.request<BaseResponse<any>>("delete", "/category", {
    data
  });
};
