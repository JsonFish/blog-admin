import { http } from "@/utils/http";
enum API {
  Dynamic = "/talk"
}
export const getDynamic = () => {
  return http.request<BaseResponse<any>>("get", API.Dynamic);
};
export const addDynamic = (data: any) => {
  return http.request<BaseResponse<any>>("post", API.Dynamic, { data });
};
export const deleteDynamic = (data: any) => {
  return http.request<BaseResponse<any>>("delete", API.Dynamic, { data });
};
