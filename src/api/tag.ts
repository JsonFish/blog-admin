import { http } from "@/utils/http";
/** 获取标签列表 */
export const getTagList = (params: object) => {
  return http.request<any>("get", "/tag", { params });
};
/** 新增标签 */
export const addTag = (data: object) => {
  return http.request<any>("post", "/tag", { data });
};
/** 修改标签 */
export const updateTag = (data: object) => {
  return http.request<any>("put", "/tag", { data });
};
/** 删除标签 */
export const deleteTag = (data: number) => {
  return http.request<any>("delete", `/tag`, { data });
};
