import { http } from "@/utils/http";
/** 获取用户列表 */
export const getUserList = (params: object) => {
  return http.request<any>("get", "/user", { params });
};
/** 修改用户信息 */
export const updateUser = (data: object) => {
  return http.request<BaseResponse<any>>("put", "/user", { data });
};
/** 拉黑用户 */
export const changeUserStatus = (data: object) => {
  return http.request<BaseResponse<any>>("delete", `/user`, { data });
};
