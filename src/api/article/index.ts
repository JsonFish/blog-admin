import { http } from "@/utils/http";
// 获取文章列表
export const getArticle = (params: object) => {
  return http.request("get", "/article", { params });
};
// 新增或者修改文章
export const addOrUpdateArticle = (data: object) => {
  return http.request<BaseResponse<any>>("post", "/article", { data });
};

// 删除文章
export const deletArticle = (data: object) => {
  return http.request<BaseResponse<any>>("delete", "/article", { data });
};

// 获取草稿
export const getDraft = (params: object) => {
  return http.request<BaseResponse<any>>("get", "/article/draft", { params });
};

// 保存草稿
export const addDraft = (data: object) => {
  return http.request<BaseResponse<any>>("post", "/article/draft", { data });
};
