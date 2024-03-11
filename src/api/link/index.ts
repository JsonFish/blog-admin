import { http } from "@/utils/http";
/** 获取友链 */
export const getFriendLink = (params?: object) => {
  return http.request<BaseResponse<any>>("get", "/link", {
    params
  });
};
/** 添加友链 */
export const addFriendLink = (data: object) => {
  return http.request<BaseResponse<any>>("post", "/link", { data });
};
// 同意友链申请
export const agreeLink = (data: object) => {
  return http.request<BaseResponse<any>>("post", "/link/accept", { data });
};
/** 修改友链 */
export const updateFriendLink = (data: object) => {
  return http.request<BaseResponse<any>>("put", "/link", { data });
};
/** 删除友链 */
export const deleteFriendLink = (data: object) => {
  return http.request<BaseResponse<any>>("delete", "/link", {
    data
  });
};
