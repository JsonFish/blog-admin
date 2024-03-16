import { http } from "@/utils/http";
import { DynamicData, DynamicInfo } from "./type";
enum Path {
  Dynamic = "/dynamic"
}
export const getDynamic = () => {
  return http.request<BasicResponse<DynamicData>>("get", Path.Dynamic);
};
export const addDynamic = (data: DynamicInfo) => {
  return http.request<BasicResponse>("post", Path.Dynamic, { data });
};
export const deleteDynamic = (data: { id: number }) => {
  return http.request<BasicResponse>("delete", Path.Dynamic, { data });
};
