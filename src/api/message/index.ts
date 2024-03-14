import { http } from "@/utils/http";
/** 获取留言 */
export const getMessage = (params?: any) => {
  return http.request<BaseResponse<any>>("get", "/message", {
    params
  });
};
/** 添加留言 */
export const addMessage = (data: any) => {
  return http.request<BaseResponse<any>>("post", "/message", { data });
};
/** 审核留言 */
export const updateMessage = (data: any) => {
  return http.request<BaseResponse<any>>("put", "/message", { data });
};
/** 删除留言 */
export const deleteMessage = (data: any) => {
  return http.request<BaseResponse<any>>("delete", "/message", {
    data
  });
};
