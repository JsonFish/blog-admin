import { http } from "@/utils/http";
import type { MessageData } from "./type";
enum Path {
  Message = "/message"
}
/** 获取留言 */
export const getMessage = (params?: any) => {
  return http.request<BasicResponse<MessageData>>("get", Path.Message, {
    params
  });
};
/** 添加留言 */
export const addMessage = (data: any) => {
  return http.request<BasicResponse>("post", Path.Message, { data });
};
/** 审核留言 */
export const updateMessage = (data: { id: number }) => {
  return http.request<BasicResponse>("put", Path.Message, { data });
};
/** 删除留言 */
export const deleteMessage = (data: { id: number[] }) => {
  return http.request<BasicResponse>("delete", Path.Message, {
    data
  });
};
