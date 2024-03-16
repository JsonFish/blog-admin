import { http } from "@/utils/http";
import type { QueryParams, UserInfo } from "./type";
enum Path {
  User = "/user"
}
/** 获取用户列表 */
export const getUserList = (params: QueryParams) => {
  return http.request<any>("get", Path.User, { params });
};
/** 修改用户信息 */
export const updateUser = (data: UserInfo) => {
  return http.request<BasicResponse>("put", Path.User, { data });
};
/** 拉黑用户 */
export const changeUserStatus = (data: { id: number }) => {
  return http.request<BasicResponse>("delete", Path.User, { data });
};
