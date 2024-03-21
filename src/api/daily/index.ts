import { http } from "@/utils/http";
import { DynamicData, DynamicInfo } from "./type";
enum Path {
  Dynamic = "/daily"
}
export const getDynamic = (params: any) => {
  return http.request<BasicResponse<DynamicData>>("get", Path.Dynamic, {
    params
  });
};
export const addDynamic = (data: DynamicInfo) => {
  return http.request<BasicResponse>("post", Path.Dynamic, { data });
};
export const deleteDynamic = (data: { id: number }) => {
  return http.request<BasicResponse>("delete", Path.Dynamic, { data });
};
