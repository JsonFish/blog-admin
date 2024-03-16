import { http } from "@/utils/http";
import type {
  QueryParams,
  CategoryForm,
  CategoryData,
  DeleteParams
} from "./type";
enum Path {
  Category = "/category"
}
/** 获取分类 */
export const getCategoryList = (params?: QueryParams) => {
  return http.request<BasicResponse<CategoryData>>("get", Path.Category, {
    params
  });
};
/** 添加分类 */
export const addCategory = (data: CategoryForm) => {
  return http.request<BasicResponse>("post", Path.Category, { data });
};
/** 修改分类 */
export const updateCategory = (data: CategoryForm) => {
  return http.request<BasicResponse>("put", Path.Category, { data });
};
/** 删除分类 */
export const deleteCategory = (data: DeleteParams) => {
  return http.request<BasicResponse>("delete", Path.Category, {
    data
  });
};
