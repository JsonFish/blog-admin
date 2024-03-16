import { http } from "@/utils/http";
import type { QueryParmars, LinkData, LinkInfo } from "./type";
enum Path {
  Link = "/links",
  Agree = "/links/agree"
}
/** 获取友链 */
export const getFriendLink = (params: QueryParmars) => {
  return http.request<BasicResponse<LinkData>>("get", Path.Link, {
    params
  });
};
/** 添加友链 */
export const addFriendLink = (data: LinkInfo) => {
  return http.request<BasicResponse>("post", Path.Link, { data });
};
// 同意友链申请
export const agreeLink = (data: { id: number }) => {
  return http.request<BasicResponse>("post", Path.Agree, { data });
};
/** 修改友链 */
export const updateFriendLink = (data: LinkInfo) => {
  return http.request<BasicResponse>("put", Path.Link, { data });
};
/** 删除友链 */
export const deleteFriendLink = (data: { id: number[] }) => {
  return http.request<BasicResponse>("delete", Path.Link, {
    data
  });
};
