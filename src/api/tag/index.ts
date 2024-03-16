import { http } from "@/utils/http";
import type { TagData, QueryParams, TagForm, DeleteParams } from "./type";
enum Path {
  Tag = "/tag"
}
/** 获取标签 */
export const getTagList = (params?: QueryParams) => {
  return http.request<BasicResponse<TagData>>("get", Path.Tag, { params });
};
/** 新增标签 */
export const addTag = (data: TagForm) => {
  return http.request<BasicResponse>("post", Path.Tag, { data });
};
/** 修改标签 */
export const updateTag = (data: TagForm) => {
  return http.request<BasicResponse>("put", Path.Tag, { data });
};
/** 删除标签 */
export const deleteTag = (data: DeleteParams) => {
  return http.request<BasicResponse>("delete", Path.Tag, { data });
};
