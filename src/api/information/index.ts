import { http } from "@/utils/http";
import { Information } from "./type";
// 获取前台信息
export const getInfo = () => {
  return http.request<BaseResponse<Information>>("get", "/config");
};
// 更新前台信息
export const updateInfo = (data: Information) => {
  return http.request<BaseResponse<any>>("put", "/config", { data });
};
