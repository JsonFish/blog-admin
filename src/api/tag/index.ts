import { http } from "@/utils/http";
import type {
  GetTagResponse,
  OtherTagResponse,
  QueryParams,
  TagForm
} from "./type";
/** 获取标签列表 */
export const getTagList = (params: QueryParams) => {
  return http.request<GetTagResponse>("get", "/tag", { params });
};
/** 新增标签 */
export const addTag = (data: TagForm) => {
  return http.request<OtherTagResponse>("post", "/tag", { data });
};
/** 修改标签 */
export const updateTag = (data: TagForm) => {
  return http.request<OtherTagResponse>("put", "/tag", { data });
};
/** 删除标签 */
export const deleteTag = (data: TagForm) => {
  return http.request<OtherTagResponse>("delete", `/tag`, { data });
};
