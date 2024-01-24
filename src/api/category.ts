import { http } from "@/utils/http";
/** 获取所有专栏 */
export const getCategoryList = () => {
  return http.request<any>("get", "/category/articleCategoryList");
};
/** 添加专栏 */
export const addCategory = (data: object) => {
  return http.request<any>("post", "/category/articleCategoryList", { data });
};

/** 修改专栏 */
export const updateCategory = (data: object) => {
  return http.request<any>("post", "/category/articleCategoryList", { data });
};
