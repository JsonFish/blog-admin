import { http } from "@/utils/http";
import type { QueryParams, ArticleData, ArticleInfo } from "./type";
enum Path {
  Article = "/article",
  Information = "/article/infor",
  Draft = "/article/draft",
  Status = "/article/status"
}

// 获取文章
export const getArticle = (params: QueryParams) => {
  return http.request<BasicResponse<ArticleData>>("get", Path.Article, {
    params
  });
};
// 获取文章详情
export const getArticleInfo = (params: { id: number }) => {
  return http.request<BasicResponse<ArticleInfo>>("get", Path.Information, {
    params
  });
};
// 新增文章
export const addArticle = (data: ArticleInfo) => {
  return http.request<BasicResponse>("post", Path.Article, { data });
};

// 修改文章
export const updateArticle = (data: ArticleInfo) => {
  return http.request<BasicResponse>("put", Path.Article, { data });
};

// 修改文章状态
export const updateStatus = (data: { id: number }) => {
  return http.request<BasicResponse>("put", Path.Status, { data });
};

// 删除文章
export const deletArticle = (data: { id: number }) => {
  return http.request<BasicResponse>("delete", Path.Article, { data });
};

// 获取草稿
export const getDraft = (params: QueryParams) => {
  return http.request<BasicResponse>("get", Path.Draft, { params });
};

// 新增草稿
export const addDraft = (data: ArticleInfo) => {
  return http.request<BasicResponse>("post", Path.Draft, { data });
};

// 修改草稿
export const updateDraft = (data: ArticleInfo) => {
  return http.request<BasicResponse>("put", Path.Draft, { data });
};

// 删除草稿
export const deleteDraft = (data: { id: number }) => {
  return http.request<BasicResponse>("delete", Path.Draft, { data });
};
