import { http } from "@/utils/http";
export const getArticleList = (data?: object) => {
  return http.request("get", "/article", { data });
};
