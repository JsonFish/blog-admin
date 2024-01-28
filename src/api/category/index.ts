import { http } from "@/utils/http";
/** 获取专栏 */
export const getCategoryList = (params?: object) => {
  return http.request<any>("get", "/category", { params });
};
/** 添加专栏 */
export const addCategory = (data: object) => {
  return http.request<any>("post", "/category", { data });
};

/** 修改专栏 */
export const updateCategory = (data: object) => {
  return http.request<any>("put", "/category", { data });
};
/** 删除专栏 */
export const deleteCategory = (data: object) => {
  return http.request<any>("put", "/category", { data });
};
