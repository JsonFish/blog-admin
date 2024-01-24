import { http } from "@/utils/http";
/** 获取所有标签 */
export const getTagList = (queryParams: object) => {
  return http.request<any>("get", "/tag/tagList", { queryParams });
};
/** 添加标签 */
export const addTag = (data: object) => {
  return http.request<any>("post", "/tag/addTag", { data });
};
/** 删除标签 */
export const deleteTagInfo = (id: number) => {
  return http.request<any>("post", "/tag/deleteTag", { id });
};
/** 获取标签详细信息 */
export const getTagInfo = (id: number) => {
  return http.request<any>("get", "/tag/getTag", { id });
};
/** 更新标签信息 */
export const updateTag = (data: object) => {
  return http.request<any>("post", "/tag/updateTag", { data });
};
