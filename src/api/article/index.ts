import { http } from "@/utils/http";
import type { QueryParams } from "./type";
enum API {
  ARTICLE = "/article",
  DRAFT = "/article/draft",
  ARTICLE_STATUS = "/article/status"
}
// 获取文章列表
export const getArticle = (params: QueryParams) => {
  return http.request<BaseResponse<any>>("get", API.ARTICLE, { params });
};
// 新增文章
export const addArticle = (data: object) => {
  return http.request<BaseResponse<any>>("post", API.ARTICLE, { data });
};
// 修改文章
export const updateArticle = (data: object) => {
  return http.request<BaseResponse<any>>("put", API.ARTICLE, { data });
};
// 修改文章状态
export const updateStatus = (data: object) => {
  return http.request<BaseResponse<any>>("put", API.ARTICLE_STATUS, { data });
};
// 删除文章
export const deletArticle = (data: object) => {
  return http.request<BaseResponse<any>>("delete", API.ARTICLE, { data });
};

// 获取草稿
export const getDraft = (params: QueryParams) => {
  return http.request<BaseResponse<any>>("get", API.DRAFT, { params });
};

// 新增草稿
export const addDraft = (data: object) => {
  return http.request<BaseResponse<any>>("post", API.DRAFT, { data });
};

// 修改草稿
export const updateDraft = (data: object) => {
  return http.request<BaseResponse<any>>("put", API.DRAFT, { data });
};
// 删除草稿
export const deleteDraft = (data: object) => {
  return http.request<BaseResponse<any>>("delete", API.DRAFT, { data });
};
