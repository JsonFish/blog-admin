import { http } from "@/utils/http";
import type { TagData, QueryParams, TagForm } from "./type";
/** 获取标签列表 */
export const getTagList = (params: QueryParams) => {
  return http.request<BaseResponse<TagData>>("get", "/tag", { params });
};
/** 新增标签 */
export const addTag = (data: TagForm) => {
  return http.request<BaseResponse>("post", "/tag", { data });
};
/** 修改标签 */
export const updateTag = (data: TagForm) => {
  return http.request<BaseResponse>("put", "/tag", { data });
};
/** 删除标签 */
export const deleteTag = (data: TagForm) => {
  return http.request<BaseResponse>("delete", `/tag`, { data });
};
