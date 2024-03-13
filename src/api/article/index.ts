import { http } from "@/utils/http";
// 获取文章列表
export const getArticle = (params: object) => {
  return http.request<BaseResponse<any>>("get", "/article", { params });
};
// 修改文章
export const addArticle = (data: object) => {
  return http.request<BaseResponse<any>>("post", "/article", { data });
};
// 修改文章
export const updateArticle = (data: object) => {
  return http.request<BaseResponse<any>>("put", "/article", { data });
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
// 修改草稿
export const updateDraft = (data: object) => {
  return http.request<BaseResponse<any>>("put", "/article/draft", { data });
};
// 删除草稿
export const deleteDraft = (data: object) => {
  return http.request<BaseResponse<any>>("delete", "/article/draft", { data });
};
