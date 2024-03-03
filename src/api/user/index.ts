import { http } from "@/utils/http";
/** 获取用户列表 */
export const getUserList = (params: object) => {
  return http.request<any>("get", "/tag", { params });
};
/** 新增用户 */
export const addUser = (data: object) => {
  return http.request<BaseResponse>("post", "/tag", { data });
};
/** 修改用户信息 */
export const updateUser = (data: object) => {
  return http.request<BaseResponse>("put", "/tag", { data });
};
/** 删除用户 */
export const deleteUser = (data: object) => {
  return http.request<BaseResponse>("delete", `/tag`, { data });
};
