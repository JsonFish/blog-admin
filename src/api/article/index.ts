import { http } from "@/utils/http";
// 获取文章列表
export const getArticle = (params: object) => {
  return http.request("get", "/article", { params });
};
// 新增或者修改文章
export const addOrUpdateArticle = (data: object) => {
  return http.request<BaseResponse<any>>("post", "/article", { data });
};
