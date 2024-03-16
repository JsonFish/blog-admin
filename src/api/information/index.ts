import { http } from "@/utils/http";
import { Information } from "./type";
enum Path {
  Infor = "/config"
}
// 获取前台信息
export const getInfo = () => {
  return http.request<BasicResponse<Information>>("get", Path.Infor);
};
// 更新前台信息
export const updateInfo = (data: Information) => {
  return http.request<BasicResponse>("put", Path.Infor, { data });
};
